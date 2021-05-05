const Router = require('../../app/CustomRouter');
const moduleRouter = new Router();
// moduleRouter.use('index'); // convention
moduleRouter.use({
    name: 'order',
    path: '/pages2/shop/order/index'
});
moduleRouter.use({
    name: 'detail',
    path: 'detail/detail'
});

export default moduleRouter;
