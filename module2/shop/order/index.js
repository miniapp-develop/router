import router from "../../../pages/shop/router";

Page({
    data: {},
    onLoad(query) {
        console.log('shop@order', query);
    },
    onTapGo1() {
        router.go(-1);
    },
    onTapGo100() {
        router.go(-100);
    },
    onTapOpenDetail() {
        router.push({
            name: 'detail',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapReplaceDetail() {
        router.replace({
            name: 'detail',
            params: {
                a: 100,
                b: 200
            }
        });
    },
});
