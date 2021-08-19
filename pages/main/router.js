const Router = require('../../app/CustomRouter');

const mainRouter = new Router({
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
