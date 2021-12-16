const Router = require('./libs/index');
import mainRouter from "./pages/main/router";
import shopRouter from "./pages/shop/router";

class CustomRouter extends Router {
    getParamString(params) {
        return super.getParamString(params);
    }
}

const appRouter = new CustomRouter({basePath: '/'})
    .before(data => {
        console.log('this is appRouter before', JSON.parse(JSON.stringify(data)));
        return Promise.resolve(data);
    })
    .use('main', mainRouter)
    .use('shop', shopRouter, {basePath: '/pages/shop/'})
    .use('custom', function (option) {
        console.log("this is appRouter's custom handle...", option);
        wx.showModal({
            content: 'this is appRouter\'s custom handle...'
        });
    });

export default appRouter;
