const {Router} = require('@mini-dev/router');
const router = new Router();

Page({
    data: {
        parts: [
            {title: '原生导航方法增强', desc: 'navigateTo / redirectTo / reLaunch / switchTab / navigateBack 的对象式参数、参数序列化、Promise 风格'},
            {title: 'Router 基础使用', desc: '命名路由 navigateTo({name})、custom handle、not found'},
            {title: 'Router 高级（级联）使用', desc: '多级嵌套 use、name 数组解析、跨模块跳转、全局 $router'}
        ]
    },
    onTapSwitchHome() {
        router.switchTab({url: '/pages/home/index'});
    }
});
