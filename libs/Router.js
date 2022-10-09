const {warn, error, forEach} = require('./utils');

class Router {
    constructor(option = {name: '', basePath: null, routes: []}) {
        this.name(option.name)
            .basePath(option.basePath);
        this._routes = [];
        this.befores = [];
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

    getDefaultPage() {
        return 'index';
    }

    getPagePath(name) {
        return `${name}/index`;
    }

    getNames(name) {
        return [name];
    }

    getPageUrl(name, path) {
        let basePath = this.basePath();
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
                return `${basePath}${path}`;
            }
        } else {
            return `${basePath}${this.getPagePath(name)}`;
        }
    }

    getParamString(params = {}) {
        return Object.entries(params).map(([key, value]) => {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value || '');
            return key + '=' + value;
        }).join('&');
    }

    getUrl(name, path, params = {}) {
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

    use(target, handle) {
        if (Array.isArray(target)) {
            target.forEach(name => {
                this.use(name, handle);
            });
        } else {
            let route;
            if (typeof target === "string") {
                route = {
                    name: target
                };
                if (handle instanceof Router) {//wrap sub router
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

    __dispatch(data, delegate) {
        let payload = data.payload;
        if (!payload) {
            payload = {
                name: this.getNames(this.getDefaultPage())
            };
        }

        if (payload.url) {
            return delegate(payload);
        }

        if (payload.path) {
            payload.url = this.getUrl(null, payload.path, payload.params);
            return delegate(payload);
        }

        if (typeof payload === 'string') { // eg. __dispatch('detail')
            payload = {
                name: this.getNames(payload)
            };
        } else if (typeof payload.name === "string") {// eg. __dispatch({name:'index'})
            payload.name = this.getNames(payload.name);
        }

        if (!Array.isArray(payload.name)) {
            const reason = {
                msg: "payload is incompatible",
                err: payload
            };
            error(reason);
            return Promise.reject(reason)
        } else {
            /**
             * eg. option = {name:[]}
             * eg. option = {name:['index']}
             * */
            const targetName = payload.name.shift() || this.getNames(this.getDefaultPage());
            const route = this._routes.find(ele => {
                return ele.name === targetName;
            }) || {};
            if (route.handle) {
                return route.handle({payload, type: data.type}, delegate);
            }
            payload.url = this.getUrl(targetName, route.path, payload.params);
            return delegate(payload);
        }
    }

    dispatch(data, delegate) {
        return forEach(this.befores, data)
            .then(data => {
                return this.__dispatch(data, delegate);
            });
    }

    onError(err) {
        error(err);
        return Promise.reject(err);
    }

    /**
     * navigateTo("page name")
     * navigateTo({
     *     name:'', // optional
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    navigateTo(option) {
        return this.dispatch({type: 'navigateTo', payload: option},
            delegateOptions => {
                return this.getVendor().navigateTo({
                    fail: err => {
                        this.onError({
                            code: '002',
                            msg: 'navigateTo fail',
                            err
                        });
                    },
                    ...delegateOptions
                })
            });
    }

    /**
     * redirectTo("page name")
     * redirectTo({
     *     name:'', // optional
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    redirectTo(option) {
        return this.dispatch({type: 'redirectTo', payload: option},
            delegateOptions => {
                return this.getVendor().redirectTo({
                    fail: err => {
                        this.onError({
                            code: '003',
                            msg: 'redirectTo fail',
                            err
                        });
                    },
                    ...delegateOptions
                });
            });
    }

    /**
     * reLaunch("page name")
     * reLaunch({
     *     name:'', // optional
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    reLaunch(option) {
        return this.dispatch({type: 'reLaunch', payload: option},
            delegateOptions => {
                return this.getVendor().reLaunch({
                    fail: err => {
                        this.onError({
                            code: '005',
                            msg: 'reLaunch fail',
                            err
                        });
                    },
                    ...delegateOptions
                });
            });
    }

    /**
     * navigateBack(-1)
     * navigateBack({
     *     delta:1
     * })
     * */
    navigateBack(option) {
        if (typeof option === 'number') {
            if (option <= 0) {
                return this.onError({
                    code: '004',
                    msg: `delta:${option} should > 0`
                });
            } else {
                option = {
                    delta: option
                };
            }
        }
        return this.getVendor().navigateBack({
            fail: err => {
                this.onError({
                    code: '004',
                    msg: 'navigateBack fail',
                    err
                });
            },
            ...option
        });
    }
}

module.exports = Router;