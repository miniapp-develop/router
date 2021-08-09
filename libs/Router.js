const {vendor} = require('@mini-dev/vendor');

class Router {
    constructor(option = {basePath: null, routes: []}) {
        this.basePath = option.basePath;
        this._routes = [];
        option.routes && option.routes.forEach(route => {
            if (typeof route !== 'string' && !route.name) {
                console.warn('Router.constructor#routes has no name');
                return;
            }
            this.use(route);
        });
    }

    getVendor() {
        return vendor;
    }

    getIndexName() {
        return 'index';
    }

    getPageByName(name, basePath) {
        return `${basePath}${name}/index`;
    }

    getPageByPath(path, basePath) {
        if (path.startsWith('/')) {
            return path;
        }
        return `${basePath}${path}`;
    }

    getAbsPagePath(name, path) {
        let basePath = this.basePath;
        if (!basePath) {
            console.warn('no basePath');
            basePath = '';
        }
        if (!basePath.endsWith('/')) {
            basePath = basePath + '/';
        }
        if (path) {
            return this.getPageByPath(path, basePath);
        } else {
            return this.getPageByName(name, basePath);
        }
    }

    getParamString(params = {}, encode = false) {
        return Object.entries(params).map(([key, value]) => {
            if (encode) {
                key = encodeURIComponent(key);
                value = encodeURIComponent(value);
            }
            return key + '=' + value;
        }).join('&');
    }

    getUrl(name, path, params = {}) {
        const absPath = this.getAbsPagePath(name, path);
        const qs = this.getParamString(params);
        return qs ? `${absPath}?${qs}` : absPath;
    }

    use(target, handle, option) {
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
                    if (option && option.basePath) {
                        handle.basePath = option.basePath;
                    }
                    route.handle = function () {
                        return handle.dispatch.apply(handle, arguments);
                    };
                } else if (typeof handle === 'function') {//wrap custom handle
                    route.handle = function () {
                        return handle.apply(handle, arguments);
                    }
                } else {
                    console.warn('handle should be a function or a router');
                }
            } else {// target is a object config
                route = target;
            }
            this._routes.push(route);
        }
        return this;
    }

    dispatch(option, delegate) {
        // eg. push()
        if (!option) {
            option = {
                name: [this.getIndexName()]
            };
        }
        // eg. push('index')
        if (typeof option === 'string') {
            option = {
                name: [option]
            };
        }
        // eg. push({name:'index'})
        if (typeof option.name === "string") {
            option.name = [option.name];
        }
        let targetName;
        let targetPath;
        if (Array.isArray(option.name)) {
            targetName = option.name.shift() || this.getIndexName();
            const route = this._routes.find(ele => {
                return ele.name === targetName;
            });
            if (route && route.handle) {
                return route.handle(option, delegate);
            }
            targetPath = route ? route.path : null;
        } else { // eg. push({path:'/pages/index/index'})
            targetName = null;
            targetPath = option.path;
        }
        const url = this.getUrl(targetName, targetPath, option.params);
        return delegate({url});
    }

    onError(err) {
        console.error(err);
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
}

module.exports = Router;