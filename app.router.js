const Router = require('./libs/index');
import mainRouter from "./pages/main/router";
import shopRouter from "./pages/shop/router";

class CustomRouter extends Router {
    getParamString(params) {
        return super.getParamString(params);
    }
}

const appRouter = new CustomRouter({name: 'AppRouter', basePath: '/'})
    .before(data => {
        console.log(`[${appRouter.name()}] before: user is null`);
        return Promise.resolve(data);
    })
    .use('main', mainRouter)
    .use('shop', shopRouter.basePath('/pages/shop/'))
    .use('custom', function (option) {
        wx.showModal({
            content: 'this is appRouter\'s custom handle...'
        });
    });

export default appRouter;
