function warn() {
    console.warn.apply(console, ['[Router]', ...arguments]);
}

function error() {
    console.error.apply(console, ['[Router]', ...arguments]);
}

function forEach(interceptors, data) {
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

module.exports = {warn, error, forEach};