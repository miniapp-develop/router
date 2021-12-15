import moduleRouter from "../router";
import appRouter from "../../../app.router";

Page({
    data: {},
    onLoad(query) {
        console.log("main's index onLoad", query);
    },
    onTapMainIndex() {
        moduleRouter.navigateTo({
            name: 'index',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapMainFoo() {
        moduleRouter.navigateTo({
            name: 'foo',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapShopIndex() {
        appRouter.navigateTo({
            name: ['shop', 'index'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapShopUrl() {
        appRouter.navigateTo({
            url: '/pages/shop/index/index'
        });
    },
    onTapRelaunch() {
        appRouter.reLaunch({
            name: ['shop', 'index'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapShopOrder() {
        getApp().$router.navigateTo({
            name: ['shop', 'order'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapError() {
        moduleRouter.navigateTo({
            name: ['nothing'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapCustom() {
        getApp().$router.navigateTo({
            name: 'custom',
            params: {
                a: 100,
                b: 200
            }
        });
    }
});
