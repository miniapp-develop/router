const Router = require("../libs/Router");
const vendor = require("./vendor");

describe('Router', () => {
    let wx;
    let parentRouter;
    let sonRouter;
    let grandsonRouter;
    beforeEach(() => {
        wx = vendor();

        class TRouter extends Router {
            getVendor() {
                return wx;
            }
        }

        parentRouter = new TRouter({basePath: '/parentDir', routes: [{name: 'detail', path: 'detail/detail'}]});
        sonRouter = new TRouter();
        parentRouter.use('son', sonRouter.basePath('/sonDir'));
        grandsonRouter = new TRouter();
        sonRouter.use('son', grandsonRouter.basePath('/grandsonDir'));
    });

    it('navigateTo child name', done => {
        parentRouter.navigateTo({
            name: ['son', 'son', 'index']
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/grandsonDir/index/index');
            done();
        });
    });

    it('navigateTo child name', done => {
        sonRouter.navigateTo({
            name: 'index'
        }).then(() => {
            expect(wx.navigateTo).toBeCalledTimes(1);
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/sonDir/index/index');
            done();
        });
    });
});
