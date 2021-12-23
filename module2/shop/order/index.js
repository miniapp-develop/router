import router from "../../../pages/shop/router";

Page({
    data: {},
    onLoad(query) {
        console.log('shop@order', query);
    },
    onTapGo1() {
        router.navigateBack(1);
    },
    onTapGo100() {
        router.navigateBack(100);
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
