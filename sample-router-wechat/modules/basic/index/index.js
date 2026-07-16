const moduleRouter = require('../router');
const demoPage = require('../../../utils/demo-page.behavior');

Page({
    behaviors: [demoPage],
    data: {
        demos: [
            {
                key: 'navigateTo',
                title: 'navigateTo({name})',
                desc: '命名路由跳转：通过 name 解析路径，自动序列化 params，并支持 events 事件通道',
                code: "moduleRouter.navigateTo({\n  name: 'foo',\n  params: { a: 100, b: 200 },\n  events: {\n    main_foo: function (data) {\n      console.log('acceptDataFromFoo', data);\n    }\n  }\n})"
            },
            {
                key: 'redirectTo',
                title: 'redirectTo({name})',
                desc: '命名路由重定向：关闭当前页并打开 foo',
                code: "moduleRouter.redirectTo({\n  name: 'foo',\n  params: { a: 100, b: 200 }\n})"
            },
            {
                key: 'reLaunch',
                title: 'reLaunch({name})',
                desc: '命名路由重启：清空页面栈并打开 foo',
                code: "moduleRouter.reLaunch({\n  name: 'foo',\n  params: { a: 100, b: 200 }\n})"
            },
            {
                key: 'custom',
                title: 'custom handle',
                desc: '触发 appRouter 上 use 注册的自定义处理器（name 优先于常规路由）',
                code: "getApp().$router.navigateTo({\n  name: 'custom',\n  params: { a: 100, b: 200 }\n})"
            },
            {
                key: 'notFound',
                title: 'not found',
                desc: '未注册的 name：解析为不存在的页面路径（nothing/index），wx 跳转失败',
                code: "moduleRouter.navigateTo({\n  name: ['nothing'],\n  params: { a: 100, b: 200 }\n})"
            }
        ]
    },

    onLoad(query) {
        console.log('basic\'s index onLoad', query);
        this.addLog('页面加载完成');
    },

    onRunTap(e) {
        const {key} = e.currentTarget.dataset;
        this.setData({lastAction: key});
        switch (key) {
            case 'navigateTo':
                this._run('navigateTo', () => moduleRouter.navigateTo({
                    name: 'foo',
                    params: {a: 100, b: 200},
                    events: {
                        main_foo: function (data) {
                            console.log('acceptDataFromFoo', data);
                        }
                    }
                }));
                break;
            case 'redirectTo':
                this._confirm('确认重定向', '将关闭当前页并打开 foo', () =>
                    this._run('redirectTo', () => moduleRouter.redirectTo({
                        name: 'foo',
                        params: {a: 100, b: 200}
                    })));
                break;
            case 'reLaunch':
                this._confirm('确认重启', '将清空页面栈并打开 foo', () =>
                    this._run('reLaunch', () => moduleRouter.reLaunch({
                        name: 'foo',
                        params: {a: 100, b: 200}
                    })));
                break;
            case 'custom':
                this._run('custom', () => getApp().$router.navigateTo({
                    name: 'custom',
                    params: {a: 100, b: 200}
                }));
                break;
            case 'notFound':
                this._run('notFound', () => moduleRouter.navigateTo({
                    name: ['nothing'],
                    params: {a: 100, b: 200}
                }));
                break;
        }
    }
});
