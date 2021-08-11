const Router = require("../libs/Router");
const vendor = require("./vendor");

describe('Router', () => {
    let wx;
    let mainRouter;
    let childRouter;
    beforeEach(() => {
        wx = vendor();

        class TRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        mainRouter = new TRouter({basePath: '/main/'});
        childRouter = new TRouter({basePath: '/child/'});
    });
    it('use default index', () => {
        mainRouter.push();
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/index/index');
    });
    it('use normal', () => {
        mainRouter.use('page1');
        mainRouter.push({
            name: 'page1'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
    });
    it('use array', () => {
        mainRouter.use(['page1', 'page2']);
        mainRouter.push({
            name: 'page1'
        });
        mainRouter.push({
            name: 'page2'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
        expect(wx.navigateTo.mock.calls[1][0].url).toEqual('/main/page2/index');
    });
    it('use object config', () => {
        mainRouter.use({
            name: 'page1',
            path: 'page1/filename'
        });
        mainRouter.push({
            name: 'page1'
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/filename');
    });
    it('use custom handle', () => {
        const handleFn = jest.fn();
        mainRouter.use('page1', function (option) {
            handleFn(option);
        });
        mainRouter.push({
            name: 'page1',
            params: {a: 100}
        });
        expect(handleFn.mock.calls[0][0].params).toEqual({a: 100});
    });
    it('use child router', () => {
        mainRouter.use('customName', childRouter);
        childRouter.use('page1');
        mainRouter.push({
            name: ['customName', 'page1']
        });
        expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/child/page1/index');
    });
});
