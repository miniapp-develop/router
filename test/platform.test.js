const {detect} = require('../libs/platform');

describe('platform detect', () => {
    const original = ['wx', 'my', 'tt', 'swan', 'qq'].reduce((acc, g) => {
        acc[g] = global[g];
        return acc;
    }, {});

    afterEach(() => {
        ['wx', 'my', 'tt', 'swan', 'qq'].forEach(g => {
            if (original[g] === undefined) {
                delete global[g];
            } else {
                global[g] = original[g];
            }
        });
    });

    it('returns null when no platform global is present', () => {
        expect(detect()).toBeNull();
    });

    it('detects WeChat (wx)', () => {
        global.wx = {navigateTo() {}};
        expect(detect()).toBe(global.wx);
    });

    it('detects Alipay (my)', () => {
        global.my = {navigateTo() {}};
        expect(detect()).toBe(global.my);
    });

    it('detects Douyin (tt)', () => {
        global.tt = {navigateTo() {}};
        expect(detect()).toBe(global.tt);
    });

    it('detects Baidu (swan)', () => {
        global.swan = {navigateTo() {}};
        expect(detect()).toBe(global.swan);
    });

    it('detects QQ (qq)', () => {
        global.qq = {navigateTo() {}};
        expect(detect()).toBe(global.qq);
    });

    it('respects priority: wx before my', () => {
        global.wx = {tag: 'wx'};
        global.my = {tag: 'my'};
        expect(detect().tag).toBe('wx');
    });
});
