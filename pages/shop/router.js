const Router = require('../../libs/index');
const moduleRouter = new Router({name: 'shopRouter'}).use({
    name: 'order',
    path: '/module2/shop/order/index'
}).use({
    name: 'detail',
    path: 'detail/detail'
}).before(data => {
    console.log(`[${moduleRouter.name()}] before`, JSON.parse(JSON.stringify(data)));
    return Promise.resolve(JSON.parse(JSON.stringify(data)));
});

export default moduleRouter;
