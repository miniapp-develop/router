const {Router} = require("@mini-dev/router");

// 极简示例：仅演示「引用方式 + app 基础配置」。
// 完整能力（嵌套路由 / 中间件 / 约定配置等）见 sample-router-wechat。
const appRouter = new Router({
    name: "AppRouter",
    basePath: "/pages",
    routes: ["index", "target"]
});

App({
    onLaunch() {
    },
    $router: appRouter
});
