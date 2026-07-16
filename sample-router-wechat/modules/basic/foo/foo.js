const router = require("../router");

Page({
    data: {
        queryParams: {}
    },
    onLoad(query) {
        console.log('main@foo 接收到的参数:', query);
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
    onTapSend(e) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('main_foo', {data: "data from main's foo"});
    }
});
