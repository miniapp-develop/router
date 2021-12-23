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
    it('use default index', done => {
        mainRouter.navigateTo().then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/index/index');
            done();
        });
    });
    it('use normal', done => {
        mainRouter.use('page1');
        mainRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
            done();
        });
    });
    it('use array', done => {
        mainRouter.use(['page1', 'page2']);
        mainRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/index');
            done();
        });
    });
    it('use object config', done => {
        mainRouter.use({
            name: 'page1',
            path: 'page1/filename'
        });
        mainRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/main/page1/filename');
            done();
        });
    });
    it('use custom handle', done => {
        const handleFn = jest.fn();
        mainRouter.use('page1', function (option) {
            handleFn(option);
        });
        mainRouter.navigateTo({
            name: 'page1',
            params: {a: 100}
        }).then(() => {
            expect(handleFn.mock.calls[0][0]).toEqual({
                type: 'navigateTo',
                payload: {
                    name: [],
                    params: {a: 100}
                }
            });
            done();
        });
    });
    it('use child router', done => {
        mainRouter.use('customName', childRouter);
        childRouter.use('page1');
        mainRouter.navigateTo({
            name: ['customName', 'page1']
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/child/page1/index');
            done();
        });
    });
});
