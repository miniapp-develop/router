const {warn, error, forEach} = require('./utils');

const NOP = x => x;

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
                return `${basePath}${path}`;
            }
        } else {
            return `${basePath}${this.getPagePath(name)}`;
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
        const absPath = this.getPageUrl(name, path);
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
                name: this.getNames(this.getDefaultPage())
            };
        } else if (option.path) {
            option.url = this.getUrl(null, option.path, option.params);
        }

        if (option.url) {
            return delegate(option);
        }

        if (typeof option === 'string') { // eg. __dispatch('detail')
            option = {
                name: this.getNames(option)
            };
        } else if (typeof option.name === "string") {// eg. __dispatch({name:'index'})
            option.name = this.getNames(option.name);
        }

        if (!Array.isArray(option.name)) {
            error("option is incompatible", option);
        } else {
            /**
             * eg. option = {name:[]}
             * eg. option = {name:['index']}
             * */
            const targetName = option.name.shift() || this.getNames(this.getDefaultPage());
            const route = this._routes.find(ele => {
                return ele.name === targetName;
            }) || {};
            if (route.handle) {
                return route.handle(option, delegate);
            }
            option.url = this.getUrl(targetName, route.path, option.params);
        }
        return delegate(option);
    }

    dispatch(option, delegate) {
        return forEach(this.befores, option).then(dispatchOption => {
            return this.__dispatch(dispatchOption, delegate);
        });
    }

    onError(err) {
        error(err);
    }

    /**
     * navigateTo("page name")
     * navigateTo({
     *     name:'',
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    navigateTo(option) {
        return this.dispatch(option, delegateOptions => {
            return this.getVendor().navigateTo({
                fail: err => {
                    this.onError({
                        code: '002',
                        msg: 'push fail',
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
     *     name:'',
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    redirectTo(option) {
        return this.dispatch(option, delegateOptions => {
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
     * reLaunch({
     *     name:'',
     *     path:'', // optional
     *     url:'', // optional
     *     params:{} // optional
     * })
     * */
    reLaunch(option) {
        return this.dispatch(option, delegateOptions => {
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
                this.onError({
                    code: '004',
                    msg: '`delta:${delta} should > 0`'
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