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
    it('navigateTo with null', done => {
        parentRouter.navigateTo().then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
            done();
        });
    });
    it('navigateTo with name', done => {
        parentRouter.navigateTo('detail').then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail');
            done();
        });
    });
    it('navigateTo non exist name', done => {
        parentRouter.navigateTo('none-exist').then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/none-exist/index');
            done();
        });
    });
    it('navigateTo relative path', done => {
        parentRouter.navigateTo({
            path: 'relative/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/relative/index');
            done();
        });
    });
    it('navigateTo absolute path', done => {
        parentRouter.navigateTo({
            path: '/absolute/index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
            done();
        });
    });
    it('navigateTo {name, params}', done => {
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
    it('navigateTo {name, path},name is ignored', done => {
        parentRouter.navigateTo({
            name: 'detail',
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
