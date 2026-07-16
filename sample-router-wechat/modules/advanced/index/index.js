const appRouter = require('../../../app.router');
const demoPage = require('../../../utils/demo-page.behavior');

const PARAMS = {a: 100, b: 200};

Page({
    behaviors: [demoPage],
    data: {
        modules: [
            {
                key: 'shop',
                title: 'shop 子路由',
                desc: 'appRouter.use("shop", shopRouter) 注册；name 数组首段命中 shop，剩余段在子路由内解析',
                accent: 'amber',
                demos: [
                    {
                        key: 'shop-index',
                        title: 'navigateTo({name:["shop","index"]})',
                        desc: '跨模块命名路由：数组逐层消费，落地 shop 首页',
                        code: "appRouter.navigateTo({\n  name: ['shop', 'index'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'shop-detail',
                        title: 'navigateTo({name:["shop","detail"]})',
                        desc: '直达 shop 子路由下的 detail 页',
                        code: "appRouter.navigateTo({\n  name: ['shop', 'detail'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'shop-order',
                        title: '$router.navigateTo({name:["shop","order"]})',
                        desc: '通过全局 getApp().$router 调用（与直接用 appRouter 等价）',
                        code: "getApp().$router.navigateTo({\n  name: ['shop', 'order'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'shop-reLaunch',
                        title: 'reLaunch({name:["shop","index"]})',
                        desc: '清空页面栈，重启到 shop 首页',
                        code: "appRouter.reLaunch({\n  name: ['shop', 'index'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'shop-to-game',
                        title: '跨模块 → navigateTo({name:["game","play"]})',
                        desc: '从 shop 跨到同级 game：name 数组首段命中 game，剩余段在其子路由内解析，落地 game 的 play 页',
                        code: "appRouter.navigateTo({\n  name: ['game', 'play'],\n  params: { a: 100, b: 200 }\n})"
                    }
                ]
            },
            {
                key: 'game',
                title: 'game 子路由',
                desc: '与 shop 同级注册 .use("game", ...)，演示多模块并行级联',
                accent: 'teal',
                demos: [
                    {
                        key: 'game-index',
                        title: 'navigateTo({name:["game","index"]})',
                        desc: '跨模块命名路由：落地 game 首页',
                        code: "appRouter.navigateTo({\n  name: ['game', 'index'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'game-play',
                        title: '$router.navigateTo({name:["game","play"]})',
                        desc: '通过全局 getApp().$router 直达 game 的 play 页',
                        code: "getApp().$router.navigateTo({\n  name: ['game', 'play'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'game-reLaunch',
                        title: 'reLaunch({name:["game","index"]})',
                        desc: '清空页面栈，重启到 game 首页',
                        code: "appRouter.reLaunch({\n  name: ['game', 'index'],\n  params: { a: 100, b: 200 }\n})"
                    },
                    {
                        key: 'game-to-shop',
                        title: '跨模块 → navigateTo({name:["shop","detail"]})',
                        desc: '从 game 跨到同级 shop：name 数组首段命中 shop，剩余段在其子路由内解析，落地 shop 的 detail 页',
                        code: "appRouter.navigateTo({\n  name: ['shop', 'detail'],\n  params: { a: 100, b: 200 }\n})"
                    }
                ]
            }
        ]
    },

    onLoad(query) {
        console.log("advanced's index onLoad", query);
        this.addLog('页面加载完成');
    },

    onRunTap(e) {
        const {key} = e.currentTarget.dataset;
        this.setData({lastAction: key});
        switch (key) {
            case 'shop-index':
                this._run(key, () => appRouter.navigateTo({name: ['shop', 'index'], params: PARAMS}));
                break;
            case 'shop-detail':
                this._run(key, () => appRouter.navigateTo({name: ['shop', 'detail'], params: PARAMS}));
                break;
            case 'shop-order':
                this._run(key, () => getApp().$router.navigateTo({name: ['shop', 'order'], params: PARAMS}));
                break;
            case 'shop-reLaunch':
                this._confirm('确认重启', '将清空页面栈并重启到 shop 首页', () =>
                    this._run(key, () => appRouter.reLaunch({name: ['shop', 'index'], params: PARAMS})));
                break;
            case 'game-index':
                this._run(key, () => appRouter.navigateTo({name: ['game', 'index'], params: PARAMS}));
                break;
            case 'game-play':
                this._run(key, () => getApp().$router.navigateTo({name: ['game', 'play'], params: PARAMS}));
                break;
            case 'game-reLaunch':
                this._confirm('确认重启', '将清空页面栈并重启到 game 首页', () =>
                    this._run(key, () => appRouter.reLaunch({name: ['game', 'index'], params: PARAMS})));
                break;
            case 'shop-to-game':
                this._run(key, () => appRouter.navigateTo({name: ['game', 'play'], params: PARAMS}));
                break;
            case 'game-to-shop':
                this._run(key, () => appRouter.navigateTo({name: ['shop', 'detail'], params: PARAMS}));
                break;
        }
    }
});
