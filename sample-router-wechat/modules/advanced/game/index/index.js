const router = require("../router");

Page({
    data: {
        queryParams: {}
    },
    onLoad(query) {
        console.log('game@index', query);
        this.setData({
            queryParams: JSON.stringify(query)
        });
    },
    onTapGo1() {
        router.navigateBack(1);
    },
    onTapGo100() {
        router.navigateBack(100);
    },
    onTapOpenPlay() {
        router.navigateTo({
            name: 'play',
            params: {
                a: 100,
                b: 200
            }
        });
    },
    onTapReplacePlay() {
        router.redirectTo({
            name: 'play',
            params: {
                a: 100,
                b: 200
            }
        });
    }
});
