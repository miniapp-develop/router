const { Router } = require('@mini-dev/router');

const basicRouter = new Router({
    name: 'basicRouter',
    basePath: '/modules/basic/',
    routes: [
        'index',
        {
            name: 'foo',
            path: 'foo/foo'
        }
    ]
}).before(data => {
    console.log(`[${basicRouter.name()}] before`, data);
    return Promise.resolve(data);
});

module.exports = basicRouter;
