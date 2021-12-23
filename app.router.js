const Router = require('./libs/index');
import mainRouter from "./pages/main/router";
import shopRouter from "./pages/shop/router";

class CustomRouter extends Router {
    getParamString(params) {
        return super.getParamString(params);
    }
}

shopRouter.basePath('/pages/shop/');

const appRouter = new CustomRouter({name: 'AppRouter', basePath: '/'})
    .before(data => {
        console.log(`[${appRouter.name()}] before`, JSON.parse(JSON.stringify(data)));
        return Promise.resolve(data);
    })
    .use('main', mainRouter)
    .use('shop', shopRouter)
    .use('custom', function (option) {
        wx.showModal({
            content: 'this is appRouter\'s custom handle...'
        });
    });

export default appRouter;
