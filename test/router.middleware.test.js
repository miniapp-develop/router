const { Router } = require("../libs");
const vendor = require("./vendor");

describe('Router middleware (before)', () => {
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
        router.before(data => { seen(data.type); return data; });
        router.navigateTo({name: 'detail'}).then(() => {
            expect(seen).toHaveBeenCalledWith('navigateTo');
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('executes in LIFO order (last registered runs first)', done => {
        const order = [];
        router.before(d => { order.push('A'); return d; });
        router.before(d => { order.push('B'); return d; });
        router.navigateTo({name: 'detail'}).then(() => {
            expect(order).toEqual(['B', 'A']);
            done();
        });
    });

    it('awaits async middleware returning a Promise', done => {
        let resolved = false;
        router.before(d => new Promise(r => setTimeout(() => { resolved = true; r(d); }, 0)));
        router.navigateTo({name: 'detail'}).then(() => {
            expect(resolved).toBe(true);
            expect(wx.navigateTo).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('middleware can mutate payload and affect the resolved URL', done => {
        router.before(d => {
            d.payload = {name: 'detail', params: {id: 9}};
            return d;
        });
        router.navigateTo({name: 'index'}).then(() => {
            expect(wx.navigateTo.mock.calls[0][0].url).toEqual('/parent/detail/index?id=9');
            done();
        });
    });

    it('middleware rejecting blocks navigation (vendor not called)', done => {
        router.before(() => Promise.reject(new Error('blocked')));
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
