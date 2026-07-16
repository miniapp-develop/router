const appRouter = require("../../app.router");

Page({
    data: {
        entries: [
            {
                key: 'native',
                title: '原生导航方法增强',
                desc: '可无缝替换 wx.navigateTo 等方法，对象式参数、参数序列化、Promise 风格',
                url: '/modules/native/methods/index'
            },
            {
                key: 'basic',
                title: 'Router 基础使用',
                desc: '依赖 router 对象的命名路由 navigateTo({name})、custom handle、not found',
                url: '/modules/basic/index/index'
            },
            {
                key: 'advanced',
                title: 'Router 高级（级联）使用',
                desc: '多级嵌套 use、name 数组式解析、跨模块跳转、全局 $router',
                url: '/modules/advanced/index/index'
            }
        ]
    },
    onTapEntry(e) {
        const {url} = e.currentTarget.dataset;
        appRouter.navigateTo({url});
    }
});
