function warn() {
    console.warn.apply(console, ['[Router]', ...arguments]);
}

function error() {
    console.error.apply(console, ['[Router]', ...arguments]);
}

function _async(interceptors, data) {
    let index = 0;
    const next = function (res) {
        const interceptor = interceptors[index++];
        if (!interceptor) {
            return Promise.resolve(res);
        }
        const ret = interceptor.call(interceptor, res);
        if (ret && ret.then) {
            return ret.then(next);
        } else {
            return next(ret);
        }
    };
    return next(data);
}

const NOP = x => Promise.resolve(x);

class Router {
    constructor(option = {basePath: null, routes: []}) {
        this.basePath = option.basePath;
        this._routes = [];
        this.befores = [NOP];
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

    getVendor() {
        return typeof wx === 'object' ? wx : null;
    }

    before(h) {
        this.befores.unshift(h);
        return this;
    }

    getDefaultIndex() {
        return 'index';
    }

    parseName(name) {
        return [name];
    }

    getPageByName(name) {
        return `${name}/index`;
    }

    getPageByPath(path) {
        return path;
    }

    getAbsPath(name, path) {
        let basePath = this.basePath;
        const SEP = '/';
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
                return `${basePath}${this.getPageByPath(path)}`;
            }
        } else {
            return `${basePath}${this.getPageByName(name)}`;
        }
    }

    getParamString(params = {}) {
        return Object.entries(params).map(([key, value]) => {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);
            return key + '=' + value;
        }).join('&');
    }

    getUrl(name, path, params = {}) {
        const absPath = this.getAbsPath(name, path);
        const qs = this.getParamString(params);
        return qs ? `${absPath}?${qs}` : absPath;
    }

    use(target, handle, option = {}) {
        if (Array.isArray(target)) {
            target.forEach(name => {
                this.use(name, handle, option);
            });
        } else {
            let route;
            if (typeof target === "string") {
                route = {
                    name: target
                };
                if (handle instanceof Router) {//wrap sub router
                    handle.basePath = option.basePath || handle.basePath;
                    route.handle = function () {
                        return handle.dispatch.apply(handle, arguments);
                    };
                } else if (typeof handle === 'function') {//wrap custom handle
                    route.handle = function () {
                        return handle.apply(handle, arguments);
                    }
                } else {
                    warn('no satisfied handle', handle);
                }
            } else {// target is a object config
                route = target;
            }
            this._routes.push(route);
        }
        return this;
    }

    __dispatch(option, delegate) {
        if (!option) {// eg. push()
            option = {
                name: this.parseName(this.getDefaultIndex())
            };
        } else if (typeof option === 'string') { // eg. push('detail')
            option = {
                name: this.parseName(option)
            };
        } else if (typeof option.name === "string") {// eg. push({name:'index'})
            option.name = this.parseName(option.name);
        }
        let targetName;
        let targetPath;
        if (Array.isArray(option.name)) {
            targetName = option.name.shift() || this.parseName(this.getDefaultIndex());
            const route = this._routes.find(ele => {
                return ele.name === targetName;
            }) || {};
            if (route.handle) {
                return route.handle(option, delegate);
            } else {
                targetPath = route.path;
            }
        } else { // eg. push({path:'/pages/index/index'})
            targetName = null;
            targetPath = option.path;
        }
        const url = this.getUrl(targetName, targetPath, option.params);
        return delegate({url});
    }

    dispatch(option, delegate) {
        _async(this.befores, option).then(data => {
            this.__dispatch(data, delegate);
        });
    }

    onError(err) {
        error(err);
    }

    /**
     * push({
     *     name:'',
     *     path:'', // optional
     *     params:{} // optional
     * })
     * */
    push(option) {
        this.dispatch(option, ({url}) => {
            this.getVendor().navigateTo({
                url: url,
                fail: (err) => {
                    this.onError({
                        code: '002',
                        msg: 'push fail',
                        err
                    });
                }
            });
        });
    }

    /**
     * replace({
     *     name:'',
     *     path:'', // optional
     *     params:{} // optional
     * })
     * */
    replace(option) {
        this.dispatch(option, ({url}) => {
            this.getVendor().redirectTo({
                url: url,
                fail: (err) => {
                    this.onError({
                        code: '003',
                        msg: 'replace fail',
                        err
                    });
                }
            });
        });
    }

    /**
     * go(-1)
     * */
    go(delta) {
        if (delta >= 0) {
            this.onError({
                code: '004',
                msg: '`delta:${delta} should < 0`'
            });
        } else {
            delta = -delta;
            this.getVendor().navigateBack({
                delta: delta
            });
        }
    }

    /**
     * reLaunch({
     *     name:'',
     *     path:'', // optional
     *     params:{} // optional
     * })
     * */
    reLaunch(option) {
        this.dispatch(option, ({url}) => {
            this.getVendor().reLaunch({
                url: url,
                fail: (err) => {
                    this.onError({
                        code: '004',
                        msg: 'reLaunch fail',
                        err
                    });
                }
            });
        });
    }
}

module.exports = Router;