const Router = require('../../libs/index');
const mainRouter = new Router({
        name: 'mainRouter',
        basePath: '/pages/main/',
        routes: [
            'index',
            {
                name: 'foo',
                path: 'foo/foo'
            }
        ]
    }
).before(data => {
    console.log(`[${mainRouter.name()}] before`, JSON.parse(JSON.stringify(data)));
    return Promise.resolve(JSON.parse(JSON.stringify(data)));
});

export default mainRouter;
