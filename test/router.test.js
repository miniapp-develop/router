const { Router } = require("../libs");
const vendor = require("./vendor");

describe('Router', () => {
    let wx;
    let parentRouter;
    beforeEach(() => {
        wx = vendor();

        class TestRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        parentRouter = new TestRouter({basePath: '/parentDir', routes: [{name: 'detail', path: 'detail/detail'}]});
    });
    it('navigateTo with nothing', done => {
        parentRouter.navigateTo().then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('navigateTo with preset name', done => {
        parentRouter.navigateTo('detail').then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail');
            done();
        });
    });
    it('navigateTo non preset name', done => {
        parentRouter.navigateTo('none-preset').then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/none-preset/index');
            done();
        });
    });
    it('navigateTo with relative path', done => {
        parentRouter.navigateTo({
            path: 'relative/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/relative/index');
            done();
        });
    });
    it('navigateTo with absolute path', done => {
        parentRouter.navigateTo({
            path: '/absolute/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
            done();
        });
    });
    it('navigateTo with url', done => {
        parentRouter.navigateTo({
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index');
            done();
        });
    });
    it('navigateTo with {name, path}, name is ignored', done => {
        parentRouter.navigateTo({
            name: 'detail',
            path: '/absolute/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
            done();
        });
    });
    it('navigateTo with {name, url}, name is ignored', done => {
        parentRouter.navigateTo({
            name: 'detail',
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index');
            done();
        });
    });
    it('navigateTo with {path, url}, path is ignored', done => {
        parentRouter.navigateTo({
            path: '/absolute/index',
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index');
            done();
        });
    });
    it('navigateTo with {name, params}', done => {
        parentRouter.navigateTo({
            name: 'detail',
            params: {
                a: 100
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail?a=100');
            done();
        });
    });
    it('navigateTo with {name, falsy params}', done => {
        parentRouter.navigateTo({
            name: 'detail',
            params: {
                none: undefined
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail?none=');
            done();
        });
    });
    it('navigateTo {path, params}', done => {
        parentRouter.navigateTo({
            path: '/absolute/index',
            params: {
                a: 100
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index?a=100');
            done();
        });
    });
    it('navigateTo {path, falsy params}', done => {
        parentRouter.navigateTo({
            path: '/absolute/index',
            params: {
                none: undefined
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index?none=');
            done();
        });
    });
    it('navigateTo {url, params}', done => {
        parentRouter.navigateTo({
            url: '/url/index?k=v',
            params: {
                a: 100
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index?k=v');
            done();
        });
    });
    it('navigateTo {url, falsy params}', done => {
        parentRouter.navigateTo({
            url: '/url/index?k=v',
            params: {
                none: undefined
            }
        }).then(() => {
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index?k=v');
            done();
        });
    });
    it('redirectTo', done => {
        parentRouter.redirectTo({
            name: []
        }).then(() => {
            expect(wx.redirectTo).toHaveBeenCalledTimes(1);
            expect(wx.redirectTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('navigateBack', () => {
        parentRouter.navigateBack(100);
        expect(wx.navigateBack).toHaveBeenCalledTimes(1);
        expect(wx.navigateBack.mock.calls[0][0].delta).toEqual(100);
    });
    it('switchTab with name', done => {
        parentRouter.switchTab({
            name: 'detail'
        }).then(() => {
            expect(wx.switchTab).toHaveBeenCalledTimes(1);
            expect(wx.switchTab.mock.calls[0][0].url).toEqual('/parentDir/detail/detail');
            done();
        });
    });
    it('switchTab with url', done => {
        parentRouter.switchTab({
            url: '/switch/url'
        }).then(() => {
            expect(wx.switchTab).toHaveBeenCalledTimes(1);
            expect(wx.switchTab.mock.calls[0][0].url).toEqual('/switch/url');
            done();
        });
    });
    it('reLaunch', done => {
        parentRouter.reLaunch({
            name: []
        }).then(() => {
            expect(wx.reLaunch).toHaveBeenCalledTimes(1);
            expect(wx.reLaunch.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    // --- 优先级专项测试 ---
    it('priority: url 优先于 path 和 params', done => {
        parentRouter.navigateTo({
            url: '/url/a',
            path: '/path/b',
            params: {x: 1}
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/a');
            done();
        });
    });
    it('priority: path 优先于 name', done => {
        parentRouter.navigateTo({
            path: '/path/c',
            name: 'detail'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/path/c');
            done();
        });
    });
    it('priority: name 解析后拼接 params', done => {
        parentRouter.navigateTo({
            name: 'detail',
            params: {k: 'v'}
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail?k=v');
            done();
        });
    });
    it('priority: 无 url/path/name 走默认页面', done => {
        parentRouter.navigateTo({}).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('resolve 返回注册路由的完整 URL', () => {
        const url = parentRouter.resolve('detail');
        expect(url).toEqual('/parentDir/detail/detail');
    });
    it('resolve 对未注册名称抛出错误', () => {
        expect(() => {
            parentRouter.resolve('nonexistent');
        }).toThrow('Route with name "nonexistent" not found');
    });

    // --- review 修复回归测试 ---
    it('getParamString 保留假值 0（不再坍缩为空串）', done => {
        parentRouter.navigateTo({
            name: 'detail',
            params: {count: 0, flag: false, empty: ''}
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url)
                .toEqual('/parentDir/detail/detail?count=0&flag=false&empty=');
            done();
        });
    });
    it('use(name, 字符串路径) 将字符串作为 path', done => {
        parentRouter.use('byPath', '/pages/by/path/index');
        parentRouter.navigateTo({name: 'byPath'}).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/pages/by/path/index');
            done();
        });
    });
    it('navigateBack 返回 thenable Promise', done => {
        parentRouter.navigateBack({delta: 2}).then(() => {
            expect(wx.navigateBack).toHaveBeenCalledTimes(1);
            expect(wx.navigateBack.mock.calls[0][0].delta).toEqual(2);
            done();
        });
    });
    it('navigateBack 数字参数仍返回 Promise', done => {
        parentRouter.navigateBack(3).then(() => {
            expect(wx.navigateBack.mock.calls[0][0].delta).toEqual(3);
            done();
        });
    });
    it('_resolveOption 不修改调用方原始 option', done => {
        const opt = {name: 'detail', params: {a: 1}};
        parentRouter.navigateTo(opt).then(() => {
            expect(opt).toEqual({name: 'detail', params: {a: 1}});
            done();
        });
    });
    it('url 分支不泄漏合成的默认 name', done => {
        parentRouter.navigateTo({url: '/only/url'}).then(() => {
            const arg = wx.navigateTo.mock.calls[0][0];
            expect(arg.url).toEqual('/only/url');
            expect(arg.name).toBeUndefined();
            done();
        });
    });
    it('path 分支消费后不泄漏 path 字段', done => {
        parentRouter.navigateTo({path: '/only/path'}).then(() => {
            const arg = wx.navigateTo.mock.calls[0][0];
            expect(arg.url).toEqual('/only/path');
            expect(arg.path).toBeUndefined();
            done();
        });
    });
});
