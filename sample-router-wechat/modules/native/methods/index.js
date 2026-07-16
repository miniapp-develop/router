/**
 * 原生导航方法增强 演示页
 *
 * 演示 @mini-dev/router 对 wx 五个原生导航方法的增强：
 * - navigateTo / redirectTo / reLaunch：均落地到 console 调试页，可在该页验证收到的参数
 * - switchTab：切换到 tabBar 页面（关于）；注意 switchTab 不支持参数（见文末）
 * - navigateBack：返回上一页
 *
 * 另含「参数解析优先级对比」：url / path / params 组合，强烈说明
 * 「只要存在 url，path 与 params 均被忽略」这一特性。
 *
 * 每个方法下方以代码块形式展示具体调用，点击「运行」即可体验。
 */
const {Router} = require('@mini-dev/router');
const demoPage = require('../../../utils/demo-page.behavior');
const router = new Router();

const CONSOLE_URL = '/modules/native/console/index';
const FOO_URL = '/modules/basic/foo/foo';
const ABOUT_TAB_URL = '/pages/about/index';
const PARAMS = {id: '123', type: 'product', source: 'native-methods'};

Page({
    behaviors: [demoPage],
    data: {
        demos: [
            {
                key: 'navigateTo',
                title: 'navigateTo',
                desc: '保留当前页面，跳转到 console（可返回）',
                code: "router.navigateTo({\n  path: '/modules/native/console/index',\n  params: { id: '123', type: 'product', source: 'native-methods' }\n})"
            },
            {
                key: 'redirectTo',
                title: 'redirectTo',
                desc: '关闭当前页面，跳转到 console（不可返回本页）',
                code: "router.redirectTo({\n  path: '/modules/native/console/index',\n  params: { id: '123', type: 'product', source: 'native-methods' }\n})"
            },
            {
                key: 'reLaunch',
                title: 'reLaunch',
                desc: '关闭所有页面，打开 console（清空页面栈）',
                code: "router.reLaunch({\n  path: '/modules/native/console/index',\n  params: { id: '123', type: 'product', source: 'native-methods' }\n})"
            },
            {
                key: 'switchTab',
                title: 'switchTab',
                desc: '切换到 tabBar 页面（关于），路径不能带参数',
                code: "router.switchTab({\n  url: '/pages/about/index'\n})"
            },
            {
                key: 'navigateBack',
                title: 'navigateBack',
                desc: '返回上一页（delta: 1）',
                code: "router.navigateBack({\n  delta: 1\n})"
            }
        ],
        // 参数解析优先级对比：全部落地 console，用 from 字段揭示实际送达值
        priorityDemos: [
            {
                key: 'url-path',
                title: 'url + path',
                code: "router.navigateTo({\n  url: '/modules/native/console/index?from=url',\n  path: '/modules/basic/foo/foo'\n})",
                effective: "/modules/native/console/index?from=url",
                receive: "from=url（path 被忽略）",
                ignored: true
            },
            {
                key: 'url-params',
                title: 'url + params',
                code: "router.navigateTo({\n  url: '/modules/native/console/index?from=url',\n  params: { from: 'params' }\n})",
                effective: "/modules/native/console/index?from=url",
                receive: "from=url（params 被忽略）",
                ignored: true
            },
            {
                key: 'path-params',
                title: 'path + params',
                code: "router.navigateTo({\n  path: '/modules/native/console/index',\n  params: { from: 'params' }\n})",
                effective: "/modules/native/console/index?from=params",
                receive: "from=params（params 生效）",
                ignored: false
            },
            {
                key: 'url-path-params',
                title: 'url + path + params',
                code: "router.navigateTo({\n  url: '/modules/native/console/index?from=url',\n  path: '/modules/basic/foo/foo',\n  params: { from: 'params' }\n})",
                effective: "/modules/native/console/index?from=url",
                receive: "from=url（path、params 全被忽略）",
                ignored: true
            }
        ]
    },

    onLoad() {
        this.addLog('页面加载完成');
    },

    onRunTap(e) {
        const {key} = e.currentTarget.dataset;
        this.setData({lastAction: key});

        switch (key) {
            case 'navigateTo':
                this._run('navigateTo', () => router.navigateTo({path: CONSOLE_URL, params: PARAMS}));
                break;
            case 'redirectTo':
                this._confirm('确认重定向', '将关闭当前页并跳转到 console', () =>
                    this._run('redirectTo', () => router.redirectTo({path: CONSOLE_URL, params: PARAMS})));
                break;
            case 'reLaunch':
                this._confirm('确认重启', '将清空页面栈并打开 console', () =>
                    this._run('reLaunch', () => router.reLaunch({path: CONSOLE_URL, params: PARAMS})));
                break;
            case 'switchTab':
                this._run('switchTab', () => router.switchTab({url: ABOUT_TAB_URL}));
                break;
            case 'navigateBack':
                this._run('navigateBack', () => router.navigateBack({delta: 1}));
                break;
        }
    },

    // 参数解析优先级对比：逐个落地 console，观察 from 实际值
    onPriorityTap(e) {
        const {key} = e.currentTarget.dataset;
        this.setData({lastAction: key});
        switch (key) {
            case 'url-path':
                this._run(key, () => router.navigateTo({url: `${CONSOLE_URL}?from=url`, path: FOO_URL}));
                break;
            case 'url-params':
                this._run(key, () => router.navigateTo({url: `${CONSOLE_URL}?from=url`, params: {from: 'params'}}));
                break;
            case 'path-params':
                this._run(key, () => router.navigateTo({path: CONSOLE_URL, params: {from: 'params'}}));
                break;
            case 'url-path-params':
                this._run(key, () => router.navigateTo({
                    url: `${CONSOLE_URL}?from=url`,
                    path: FOO_URL,
                    params: {from: 'params'}
                }));
                break;
        }
    }
});
