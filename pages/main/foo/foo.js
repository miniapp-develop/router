import router from "../router";

Page({
    data: {},
    onLoad(query) {
        console.log('main@foo', query);
    },
    onTapGo1() {
        router.navigateBack(-1);
    },
    onTapGo100() {
        router.navigateBack(-100);
    }
});
