const {Router} = require('@mini-dev/router');

const moduleRouter = new Router({
    name: 'shopRouter',
    basePath: '/modules/advanced/shop/',
    routes: [
        'index',
        'detail',
        'order'
    ]
});

module.exports = moduleRouter;
