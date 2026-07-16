const router = require("../router");

Page({
    data: {},
    onLoad(query) {
        console.log('shop@detail', query);
    },
    onTapGo1() {
        router.navigateBack(1);
    },
    onTapGo100() {
        router.navigateBack(100);
    }
});
