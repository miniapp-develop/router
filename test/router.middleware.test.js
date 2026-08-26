const { Router } = require("../libs");
const vendor = require("./vendor");

describe('Router middleware (interceptor)', () => {
    let wx;
    let router;
    beforeEach(() => {
        wx = vendor();

        class TestRouter extends Router {
            getVendor() { return wx; }
        }

        router = new TestRouter({basePath: '/parent/'});
        router.use('detail');
    });

    it('runs middleware before navigation reaches vendor', done => {
        const seen = jest.fn();
        router.interceptor(async (ctx, next) => { seen(ctx.type); await next(); });
        router.navigateTo({name: 'detail'}).then(() => {
            expect(seen).toHaveBeenCalledWith('navigateTo');
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('executes in registration order, onion style (down then up)', done => {
        const order = [];
        router.interceptor(async (ctx, next) => { order.push('A-down'); await next(); order.push('A-up'); });
        router.interceptor(async (ctx, next) => { order.push('B-down'); await next(); order.push('B-up'); });
        router.navigateTo({name: 'detail'}).then(() => {
            expect(order).toEqual(['A-down', 'B-down', 'B-up', 'A-up']);
            done();
        });
    });

    it('awaits async middleware returning a Promise', done => {
        let resolved = false;
        router.interceptor(async (ctx, next) => {
            await new Promise(r => setTimeout(() => { resolved = true; r(); }, 0));
            await next();
        });
        router.navigateTo({name: 'detail'}).then(() => {
            expect(resolved).toBe(true);
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('middleware can mutate payload and affect the resolved URL', done => {
        router.interceptor(async (ctx, next) => {
            ctx.payload = {name: 'detail', params: {id: 9}};
            await next();
        });
        router.navigateTo({name: 'index'}).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/detail/index?id=9');
            done();
        });
    });

    it('middleware throwing blocks navigation (vendor not called)', done => {
        router.interceptor(async () => { throw new Error('blocked'); });
        router.navigateTo({name: 'detail'}).then(
            () => done(new Error('should not resolve')),
            err => {
                expect(err.message).toBe('blocked');
                expect(wx.navigateTo).not.toHaveBeenCalled();
                done();
            }
        );
    });
});
