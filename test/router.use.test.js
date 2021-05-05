const Router = require("../libs/Router");

describe('Router', () => {
    let wx;
    let router;
    let childRouter;
    beforeEach(() => {
        wx = {
            navigateTo: jest.fn()
        }

        class TRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        router = new TRouter({basePath: '/main/'});
        childRouter = new TRouter({basePath: '/child/'});
    });
    it('use normal', () => {
        router.use('page1');
        router.push({
            name: 'page1'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
    });
    it('use default index', () => {
        router.push();
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/index/index');
    });
    it('use array', () => {
        router.use(['page1', 'page2']);
        router.push({
            name: 'page1'
        });
        router.push({
            name: 'page2'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
        expect(wx.navigateTo.mock.calls[1][0].url).toEqual('/main/page2/index');
    });
    it('use 3', () => {
        router.use({
            name: 'page1',
            path: 'page1/page1'
        });
        router.push({
            name: 'page1'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/page1');
    });
    it('use custom handle', () => {
        const handleFn = jest.fn();
        router.use('page1', function (option) {
            handleFn(option);
        });
        router.push({
            name: 'page1',
            params: {a: 100}
        });
        expect(handleFn.mock.calls[0][0].params).toEqual({a: 100});
    });
    it('use child router', () => {
        router.use('customName', childRouter);
        childRouter.use('page1');
        router.push({
            name: ['customName', 'page1']
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/child/page1/index');
    });
});
