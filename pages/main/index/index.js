import moduleRouter from "../router";
import appRouter from "../../../app.router";

Page({
    data: {},
    onLoad(query) {
        console.log('main@index', query);
    },
    onTapMainIndex() {
        moduleRouter.push({
            name: 'index',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapMainFoo() {
        moduleRouter.push({
            name: 'foo',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapShopIndex() {
        appRouter.push({
            name: ['shop', 'index'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapShopOrder() {
        getApp().$router.push({
            name: ['shop', 'order'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapError() {
        moduleRouter.push({
            name: ['nothing'],
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapCustom() {
        getApp().$router.push({
            name: 'custom',
            params: {
                a: 100,
                b: 200
            }
        });
    }
});
