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
}).interceptor(async (ctx, next) => {
    console.log(`[${basicRouter.name()}] before`, ctx);
    await next();
});

module.exports = basicRouter;
