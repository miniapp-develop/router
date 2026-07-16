const { Router } = require("../libs");

describe('Router getVendor auto-detect', () => {
    const originalWx = global.wx;
    afterEach(() => {
        if (originalWx === undefined) {
            delete global.wx;
        } else {
            global.wx = originalWx;
        }
    });

    it('returns null when no platform global is ready, without caching null', () => {
        delete global.wx;
        const router = new Router();
        expect(router.getVendor()).toBeNull();
        // _vendor 仍为 undefined → 下次注入可恢复，不永久缓存 null
        expect(router._vendor).toBeUndefined();
    });

    it('recovers after the platform global becomes available', () => {
        delete global.wx;
        const router = new Router();
        expect(router.getVendor()).toBeNull();
        global.wx = {navigateTo() {}};
        expect(router.getVendor()).toBe(global.wx);
    });

    it('caches the detected vendor on first success', () => {
        global.wx = {navigateTo() {}};
        const router = new Router();
        const detected = router.getVendor();
        expect(detected).toBe(global.wx);
        // 全局移除后仍返回缓存值
        delete global.wx;
        expect(router.getVendor()).toBe(detected);
    });
});
