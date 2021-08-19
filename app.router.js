const Router = require('./app/CustomRouter');
import mainRouter from "./pages/main/router";
import shopRouter from "./pages/shop/router";

const appRouter = new Router({basePath: '/'});
appRouter.use('main', mainRouter, {basePath: '/pages/main/'});
appRouter.use('shop', shopRouter, {basePath: '/pages/shop/'});
appRouter.use('custom', function (option) {
    console.log("this is appRouter's custom handle...", option);
    wx.showModal({
        content: 'this is appRouter\'s custom handle...'
    });
});

export default appRouter;
