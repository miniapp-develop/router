const Router = require("../libs/Router");
const vendor = require("./vendor");

describe('Router', () => {
    let wx;
    let parentRouter;
    let childRouter;
    beforeEach(() => {
        wx = vendor();

        class TRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        parentRouter = new TRouter({basePath: '/parent/'});
        childRouter = new TRouter({basePath: '/child/'});
    });
    it('use default index', done => {
        parentRouter.navigateTo().then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/index/index');
            done();
        });
    });
    it('use normal', done => {
        parentRouter.use('page1');
        parentRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/page1/index');
            done();
        });
    });
    it('use array', done => {
        parentRouter.use(['page1', 'page2']);
        parentRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/page1/index');
            done();
        });
    });
    it('use object config', done => {
        parentRouter.use({
            name: 'page1',
            path: 'page1/filename'
        });
        parentRouter.navigateTo({
            name: 'page1'
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/page1/filename');
            done();
        });
    });
    it('use custom handle', done => {
        const handleFn = jest.fn();
        parentRouter.use('page1', function (option) {
            handleFn(option);
        });
        parentRouter.navigateTo({
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
        parentRouter.use('customName', childRouter);
        childRouter.use('page1');
        parentRouter.navigateTo({
            name: ['customName', 'page1']
        }).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/child/page1/index');
            done();
        });
    });
});
