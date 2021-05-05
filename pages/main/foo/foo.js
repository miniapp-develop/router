import router from "../router";

Page({
    data: {},
    onLoad(query) {
        console.log('main@foo', query);
    },
    onTapGo1() {
        router.go(-1);
    },
    onTapGo100() {
        router.go(-100);
    }
});
