import router from "../router";

Page({
    data: {},
    onLoad(query) {
        console.log('shop@index', query);
    },
    onTapGo1() {
        router.go(-1);
    },
    onTapGo100() {
        router.go(-100);
    },
    onTapOpenOrder() {
        router.push({
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
