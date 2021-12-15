import router from "../router";

Page({
    data: {},
    onLoad(query) {
        console.log('shop@index', query);
    },
    onTapGo1() {
        router.navigateBack(-1);
    },
    onTapGo100() {
        router.navigateBack(-100);
    },
    onTapOpenOrder() {
        router.navigateTo({
            name: 'order',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapReplaceOrder() {
        router.replace({
            name: 'order',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapOpenDetail() {
        router.navigateTo({
            name: 'detail',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapReplaceDetail() {
        router.redirectTo({
            name: 'detail',
            params: {
                a: 100,
                b: 200
            }
        });
    },
});
