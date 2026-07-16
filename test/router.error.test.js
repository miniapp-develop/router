const { Router } = require("../libs");
const vendor = require("./vendor");

describe('Router error handling', () => {
    let wx;
    let router;
    let errorSpy;
    beforeEach(() => {
        wx = vendor();

        class TestRouter extends Router {
            getVendor() { return wx; }
        }

        router = new TestRouter({basePath: '/parent/'});
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => errorSpy.mockRestore());

    it('navigateBack(0) is rejected with NAV_BACK and never calls vendor', done => {
        router.navigateBack(0).then(
            () => done(new Error('should not resolve')),
            err => {
                expect(err.code).toBe('NAV_BACK');
                expect(wx.navigateBack).not.toHaveBeenCalled();
                done();
            }
        );
    });

    it('navigateBack with negative delta is rejected', done => {
        router.navigateBack(-2).then(
            () => done(new Error('should not resolve')),
            err => {
                expect(err.code).toBe('NAV_BACK');
                done();
            }
        );
    });

    it('vendor fail callback rejects with NAV_FAIL and routes through onError', done => {
        wx.navigateTo.mockImplementation(opt => opt.fail({errMsg: 'navigateTo:fail'}));
        router.navigateTo({url: '/x/index'}).then(
            () => done(new Error('should not resolve')),
            err => {
                expect(err.code).toBe('NAV_FAIL');
                expect(err.type).toBe('navigateTo');
                // onError 触发 error() 日志
                expect(errorSpy.mock.calls.some(c => c[1] && c[1].code === 'NAV_FAIL')).toBe(true);
                done();
            }
        );
    });

    it('transparently invokes caller-supplied success/fail callbacks', done => {
        const userSuccess = jest.fn();
        router.navigateTo({url: '/x/index', success: userSuccess}).then(() => {
            expect(userSuccess).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('invokes caller-supplied fail callback on failure, then rejects', done => {
        const userFail = jest.fn();
        wx.navigateTo.mockImplementation(opt => opt.fail({errMsg: 'navigateTo:fail'}));
        router.navigateTo({url: '/x/index', fail: userFail}).then(
            () => done(new Error('should not resolve')),
            err => {
                expect(userFail).toHaveBeenCalledTimes(1);
                expect(err.code).toBe('NAV_FAIL');
                done();
            }
        );
    });
});
