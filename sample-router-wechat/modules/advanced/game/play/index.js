const router = require("../router");

Page({
    data: {},
    onLoad(query) {
        console.log('game@play', query);
    },
    onTapGo1() {
        router.navigateBack(1);
    },
    onTapGo100() {
        router.navigateBack(100);
    }
});
