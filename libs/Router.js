const {warn, error} = require('./utils');
const {detect: detectPlatform} = require('./platform');
const compose = require('koa-compose');

const SEP = '/';
const DEFAULT_PAGE = 'index';

class Router {
    constructor(option = {name: '', basePath: null, routes: []}) {
        this.name(option.name)
            .basePath(option.basePath);
        this._routeMap = new Map();
        this._interceptors = [];
        this._vendor = option.vendor; // undefined = auto-detect on first use
        this._delegates = {};
        if (option.routes) {
            option.routes.forEach(route => {
                if (typeof route !== 'string' && !route.name) {
                    warn(route, ' has no name');
                    return;
                }
                this.use(route);
            });
        }
    }

    /**
     * 返回当前平台的原生导航对象（微信 wx / 支付宝 my / 抖音 tt / 百度 swan / QQ qq）。
     * 自动检测仅在成功时缓存，避免平台全局尚未就绪时永久缓存 null。子类可覆写。
     */
    getVendor() {
        if (this._vendor === undefined) {
            const detected = detectPlatform();
            if (detected) {
                this._vendor = detected; // 仅缓存有效值，未就绪时下次重试
            }
            return detected;
        }
        return this._vendor;
    }

    /**
     * 注册洋葱中间件（koa-compose 风格）。注册序 down、逆序 up（after 钩子）。
     * 签名 (ctx, next) => Promise<void>：await next() 之前为 down 阶段（鉴权 / 埋点 / 改写 ctx.payload），
     * 之后为 up 阶段（可读 ctx.result）。不调 next 即短路（导航不发生），throw 即阻断（vendor 不调用）。
     * ctx = {type, payload, router, state, result}；payload 即将进入解析的 option（url > path > name）。
     */
    interceptor(mw) {
        this._interceptors.push(mw);
        return this;
    }

    getDefaultPage() {
        return DEFAULT_PAGE;
    }

    getPagePath(name) {
        return `${name}/${DEFAULT_PAGE}`;
    }

    getNames(name) {
        return [name];
    }

    /**
     * path + basePath → 完整页面路径
     * - 绝对路径（以 / 开头）：直接返回 path，忽略 basePath
     * - 相对路径：basePath + path
     * - 无 path：basePath + name/index
     */
    getPageUrl(name, path) {
        let basePath = this.basePath();
        if (!basePath) {
            warn('no basePath');
            basePath = '';
        } else if (!basePath.endsWith(SEP)) {
            basePath = basePath + SEP;
        }
        if (path) {
            if (path.startsWith(SEP)) {
                return path;
            } else {
                return `${basePath}${path}`;
            }
        } else {
            return `${basePath}${this.getPagePath(name)}`;
        }
    }

    /**
     * 参数序列化（单次遍历，避免 .map 中间数组）
     * null/undefined 编码为空字符串；0/false 等假值原样保留（0 → '0'）
     */
    getParamString(params = {}) {
        const parts = [];
        for (const [key, value] of Object.entries(params)) {
            const safe = value == null ? '' : value;
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(safe));
        }
        return parts.join('&');
    }

    /** 内部：页面路径 + 参数 → 完整 URL */
    _getUrl(name, path, params = {}) {
        const absPath = this.getPageUrl(name, path);
        const qs = this.getParamString(params);
        return qs ? `${absPath}?${qs}` : absPath;
    }

    name() {
        if (arguments.length > 0) {
            this._name = arguments[0];
            return this;
        } else {
            return this._name;
        }
    }

    basePath() {
        if (arguments.length > 0) {
            this._basePath = arguments[0];
            return this;
        } else {
            return this._basePath;
        }
    }

    /**
     * 路由注册。子类覆写必须调用 super.use() 或同步维护 _routeMap。
     *
     * use('name')                          — 字符串名，路径自动推导
     * use(['a', 'b'])                      — 批量注册
     * use({name, path})                    — 对象配置
     * use('name', '/path/to/page')         — 字符串路径
     * use('name', childRouter)             — 注册子 Router（嵌套路由）
     * use('name', customFunction)          — 自定义处理函数
     */
    use(target, handle) {
        if (Array.isArray(target)) {
            target.forEach(name => {
                this.use(name, handle);
            });
        } else {
            let route;
            if (typeof target === "string") {
                route = {name: target};
                if (handle instanceof Router) {
                    route.handle = function () {
                        return handle.dispatch.apply(handle, arguments);
                    };
                } else if (typeof handle === 'function') {
                    route.handle = function () {
                        return handle.apply(handle, arguments);
                    };
                } else if (typeof handle === 'string') {
                    route.path = handle;
                }
                // 无 handle：仅注册名字，路径自动推导
            } else {
                route = target;
            }
            if (this._routeMap.has(route.name)) {
                warn('overwrite route name: ' + route.name);
            }
            this._routeMap.set(route.name, route);
        }
        return this;
    }

    /**
     * 统一解析管线
     *
     * 优先级: url > path > name > default('index')
     *
     * 1. url 存在 → 直接透传，path/params/name 全部忽略
     * 2. path 存在 → url = basePath + path + params，name 忽略
     * 3. name 存在（string 或 array）→ 逐层消费数组，查找路由表
     *    - 有 handle（子Router/自定义函数）→ 递归委托
     *    - 无 handle → url = basePath + (route.path || name/index) + params
     * 4. 都没有 → 默认页面 'index'
     *
     * 始终在 payload 副本上操作，不修改调用方传入的原始 option 对象。
     * 归一化（合成默认 name）推迟到 name 分支，避免 name 泄漏进 url/path 的最终调用。
     */
    _resolveOption(data, delegate) {
        let payload = data.payload;

        // --- 归一化为对象副本（字符串/空 → 对象），后续不再触碰原始 option ---
        if (!payload) {
            payload = {};
        } else if (typeof payload === 'string') {
            payload = {name: this.getNames(payload)};
        } else {
            payload = {...payload};
        }

        // --- 优先级 1: url 存在 → 直接透传，path/params/name 全部忽略 ---
        if (payload.url) {
            return delegate(payload);
        }

        // --- 优先级 2: path 存在 → url = getUrl(null, path, params)，name 忽略 ---
        if (payload.path) {
            payload.url = this._getUrl(null, payload.path, payload.params);
            delete payload.path;
            return delegate(payload);
        }

        // --- 优先级 3: name → 归一化为数组后逐层消费 ---
        if (typeof payload.name === 'string') {
            payload.name = this.getNames(payload.name);
        } else if (!payload.name) {
            payload.name = this.getNames(this.getDefaultPage());
        }

        const targetName = payload.name[0] || this.getDefaultPage();
        const route = this._routeMap.get(targetName) || {};

        if (route.handle) {
            // 有 handle → 递归委托给子 Router 或自定义函数
            payload.name = payload.name.slice(1);
            return route.handle(
                {payload, type: data.type},
                delegate
            );
        }

        // 无 handle → 终端路由：name → path → url
        payload.url = this._getUrl(targetName, route.path, payload.params);
        delete payload.name;
        return delegate(payload);
    }

    /**
     * 调度入口：跑洋葱中间件链，链尾 terminal 执行解析管线（_resolveOption）。
     * 中间件可改写 ctx.payload；terminal 把 ctx.payload 同步回 data.payload 再解析。
     * throw / 不调 next 阻断；阻断与导航失败均向外抛出（delegate 内部已走 onError）。
     */
    dispatch(data, delegate) {
        const ctx = {
            type: data.type,
            payload: data.payload,
            router: this,
            state: {},
            result: undefined
        };
        const terminal = async (ctx) => {
            data.payload = ctx.payload;
            ctx.result = await this._resolveOption(data, delegate);
        };
        return compose([...this._interceptors, terminal])(ctx).then(() => ctx.result);
    }

    /** 懒加载 delegate：首次调用时创建并缓存，vendor 动态获取避免快照过期 */
    _getDelegate(type) {
        if (!this._delegates[type]) {
            this._delegates[type] = (option) => {
                // 包进 Promise：success → resolve，fail → reject（经 onError）。
                // 透传调用方自带的 success/fail，保持平台原生回调语义。
                const userSuccess = option && option.success;
                const userFail = option && option.fail;
                return new Promise((resolve, reject) => {
                    this.getVendor()[type]({
                        ...option,
                        success: (res) => {
                            if (userSuccess) userSuccess(res);
                            resolve(res);
                        },
                        fail: (err) => {
                            if (userFail) userFail(err);
                            reject({
                                code: 'NAV_FAIL',
                                type,
                                msg: `${type} fail`,
                                err
                            });
                        }
                    });
                }).catch(err => this.onError(err));
            };
        }
        return this._delegates[type];
    }

    onError(err) {
        error(err);
        return Promise.reject(err);
    }

    /**
     * 根据注册的名称反查 URL
     * @param {string} name - 已注册的路由名称
     * @returns {string} 完整 URL（含 basePath）
     * @throws {Error} 如果 name 未注册
     */
    resolve(name) {
        const route = this._routeMap.get(name);
        if (!route) {
            throw new Error(`Route with name "${name}" not found`);
        }
        return this._getUrl(name, route.path);
    }

    /**
     * navigateBack(-1)
     * navigateBack({delta: 1})
     *
     * 注意：navigateBack 不经过 dispatch/_resolveOption/middleware。
     * 返回 Promise 以与其它导航方法对齐（wx.navigateBack 本身无返回值）。
     */
    navigateBack(option) {
        if (typeof option === 'number') {
            if (option <= 0) {
                return this.onError({
                    code: 'NAV_BACK',
                    type: 'navigateBack',
                    msg: `delta:${option} should > 0`
                });
            }
            option = {delta: option};
        }
        return Promise.resolve(this._getDelegate('navigateBack')(option));
    }
}

// 四个 URL 类导航方法：结构相同，仅 type 不同
['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].forEach(type => {
    Router.prototype[type] = function (option) {
        return this.dispatch(
            {type, payload: option},
            this._getDelegate(type)
        );
    };
});

module.exports = Router;
