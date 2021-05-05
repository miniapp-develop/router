const Router = require("../libs/Router");

describe('Router', () => {
    let wx;
    let parentRouter;
    let sonRouter;
    let grandsonRouter;
    beforeEach(() => {
        wx = {
            navigateTo: jest.fn(),
            redirectTo: jest.fn(),
            navigateBack: jest.fn()
        }

        class TRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        parentRouter = new TRouter({basePath: '/parentDir', routes: [{name: 'detail', path: 'detail/detail'}]});
        sonRouter = new TRouter({basePath: '/sonDir'});
        grandsonRouter = new TRouter({basePath: '/grandsonDir'});
        parentRouter.use('son', sonRouter);
        sonRouter.use('son', grandsonRouter);
    });
    it('push null option', () => {
        parentRouter.push();
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
    });
    it('push string name', () => {
        parentRouter.push('detail');
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail');
    });
    it('push non exist name', () => {
        parentRouter.push('none');
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/none/index');
    });
    it('push relative path', () => {
        parentRouter.push({
            path: 'relative/index'
        });
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/relative/index');
    });
    it('push absolute path', () => {
        parentRouter.push({
            path: '/absolute/index'
        });
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index');
    });
    it('push name and params', () => {
        parentRouter.push({
            name: 'detail',
            params: {
                a: 100
            }
        });
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail?a=100');
    });
    it('push path and params', () => {
        parentRouter.push({
            path: '/absolute/index',
            params: {
                a: 100
            }
        });
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/absolute/index?a=100');
    });
    it('push name and path,path is ignored', () => {
        parentRouter.push({
            name: 'detail',
            path: '/absolute/index',
            params: {
                a: 100
            }
        });
        expect(wx.navigateTo).toBeCalledTimes(1);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/detail/detail?a=100');
    });
    it('push child name', () => {
        parentRouter.push({
            name: []
        });
        parentRouter.push({
            name: 'son'
        });
        parentRouter.push({
            name: ['son']
        });

        parentRouter.push({
            name: ['son', 'index']
        });

        parentRouter.push({
            name: ['son', 'son', 'index']
        });

        sonRouter.push({
            name: 'index'
        });
        expect(wx.navigateTo).toBeCalledTimes(6);
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
        expect(wx.navigateTo.mock.calls[1][0].url).toEqual('/sonDir/index/index');
        expect(wx.navigateTo.mock.calls[2][0].url).toEqual('/sonDir/index/index');
        expect(wx.navigateTo.mock.calls[3][0].url).toEqual('/sonDir/index/index');
        expect(wx.navigateTo.mock.calls[4][0].url).toEqual('/grandsonDir/index/index');
        expect(wx.navigateTo.mock.calls[5][0].url).toEqual('/sonDir/index/index');
    });
    it('replace', () => {
        parentRouter.replace({
            name: []
        });
        parentRouter.replace({
            name: 'son'
        });
        parentRouter.replace({
            name: ['son']
        });

        parentRouter.replace({
            name: ['son', 'index']
        });

        sonRouter.replace({
            name: 'index'
        });
        expect(wx.redirectTo).toBeCalledTimes(5);
        expect(wx.redirectTo.mock.calls[0][0].url).toEqual('/parentDir/index/index');
        expect(wx.redirectTo.mock.calls[1][0].url).toEqual('/sonDir/index/index');
        expect(wx.redirectTo.mock.calls[2][0].url).toEqual('/sonDir/index/index');
        expect(wx.redirectTo.mock.calls[3][0].url).toEqual('/sonDir/index/index');
        expect(wx.redirectTo.mock.calls[4][0].url).toEqual('/sonDir/index/index');
    });
    it('go', () => {
        parentRouter.go(-1);
        parentRouter.go(-100);
        sonRouter.go(-1);
        expect(wx.navigateBack).toBeCalledTimes(3);
        expect(wx.navigateBack.mock.calls[0][0].delta).toEqual(1);
        expect(wx.navigateBack.mock.calls[1][0].delta).toEqual(100);
        expect(wx.navigateBack.mock.calls[2][0].delta).toEqual(1);
    });
});
