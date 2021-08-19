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
).before(data => {
    console.log('this is mainRouter before', data);
    return Promise.resolve(JSON.parse(JSON.stringify(data)));
});

export default mainRouter;
