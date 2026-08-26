const app = getApp();

Page({
    onTapNavigate() {
        app.$router.navigateTo({
            name: "target",
            params: {from: "index", a: 100, b: 200}
        });
    }
});
