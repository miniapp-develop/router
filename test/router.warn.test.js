const { Router } = require("../libs");
const vendor = require("./vendor");

describe('Router warnings & getters', () => {
    let warnSpy;
    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => warnSpy.mockRestore());

    const warnedText = () => warnSpy.mock.calls.map(c => c.slice(1).join(' '));

    it('warns when overwriting an already-registered route name', () => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        const r = new TR({basePath: '/p/'});
        r.use('page1');
        r.use('page1');
        expect(warnedText().some(m => m.includes('overwrite route name: page1'))).toBe(true);
    });

    it('warns when a constructor route has no name', () => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        new TR({basePath: '/p/', routes: [{path: 'no-name'}]});
        expect(warnedText().some(m => m.includes('has no name'))).toBe(true);
    });

    it('warns when navigating without a basePath', done => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        const r = new TR();
        r.navigateTo().then(() => {
            expect(warnedText().some(m => m.includes('no basePath'))).toBe(true);
            done();
        });
    });

    it('name() / basePath() act as getters when called with no args', () => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        const r = new TR({name: 'root', basePath: '/root/'});
        expect(r.name()).toBe('root');
        expect(r.basePath()).toBe('/root/');
    });

    it('getParamString() with no args defaults to empty object', () => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        const r = new TR({basePath: '/p/'});
        expect(r.getParamString()).toBe('');
    });

    it('delegate is cached across repeated calls of the same type', done => {
        const wx = vendor();
        class TR extends Router { getVendor() { return wx; } }
        const r = new TR({basePath: '/p/'});
        r.navigateTo({url: '/a/index'}).then(() =>
            r.navigateTo({url: '/b/index'}).then(() => {
                expect(wx.navigateTo).toHaveBeenCalledTimes(2);
                expect(Object.keys(r._delegates)).toEqual(['navigateTo']);
                done();
            })
        );
    });
});
