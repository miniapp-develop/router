const Router = require('../../app/CustomRouter');
const moduleRouter = new Router();
moduleRouter.use({
    name: 'order',
    path: '/module2/shop/order/index'
}).use({
    name: 'detail',
    path: 'detail/detail'
});

export default moduleRouter;
