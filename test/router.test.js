const Router = require("../libs/Router");
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
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('navigateTo with preset name', done => {
        parentRouter.navigateTo('detail').then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail');
            done();
        });
    });
    it('navigateTo non preset name', done => {
        parentRouter.navigateTo('none-preset').then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/none-preset/index');
            done();
        });
    });
    it('navigateTo with relative path', done => {
        parentRouter.navigateTo({
            path: 'relative/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/relative/index');
            done();
        });
    });
    it('navigateTo with absolute path', done => {
        parentRouter.navigateTo({
            path: '/absolute/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
            done();
        });
    });
    it('navigateTo with url', done => {
        parentRouter.navigateTo({
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index');
            done();
        });
    });
    it('navigateTo with {name, path}, name is ignored', done => {
        parentRouter.navigateTo({
            name: 'detail',
            path: '/absolute/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
            done();
        });
    });
    it('navigateTo with {name, url}, name is ignored', done => {
        parentRouter.navigateTo({
            name: 'detail',
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index');
            done();
        });
    });
    it('navigateTo with {path, url}, path is ignored', done => {
        parentRouter.navigateTo({
            path: '/absolute/index',
            url: '/url/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
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
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/url/index?k=v');
            done();
        });
    });
    it('redirectTo', done => {
        parentRouter.redirectTo({
            name: []
        }).then(() => {
            expect(wx.redirectTo).toBeCalledTimes(1);
            expect(wx.redirectTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('navigateBack', () => {
        parentRouter.navigateBack(100);
        expect(wx.navigateBack).toBeCalledTimes(1);
        expect(wx.navigateBack.mock.calls[0][0].delta).toEqual(100);
    });
    it('reLaunch', done => {
        parentRouter.reLaunch({
            name: []
        }).then(() => {
            expect(wx.reLaunch).toBeCalledTimes(1);
            expect(wx.reLaunch.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
});
