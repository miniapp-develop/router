const Router = require('../../app/CustomRouter');

const mainRouter = new Router({
        basePath: '/pages/main/',
        routes: [
            'index',
            {
                name: 'foo',
                path: 'foo/foo'
            }
        ]
    }
);

export default mainRouter;
