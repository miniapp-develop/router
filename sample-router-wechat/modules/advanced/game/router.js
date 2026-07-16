const {Router} = require('@mini-dev/router');

const moduleRouter = new Router({
    name: 'gameRouter',
    basePath: '/modules/advanced/game/',
    routes: [
        'index',
        'play'
    ]
});

module.exports = moduleRouter;
