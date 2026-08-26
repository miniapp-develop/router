const {Router} = require('../libs');

/**
 * 平台透传专项测试。
 *
 * 库的定位是「增强路由」而非「统一路由」：getVendor() 探测到哪个平台的全局对象，
 * 就把增强后的原生参数原样透传给该平台对应的方法。这里对微信之外的四个平台
 * （支付宝 my / 抖音 tt / 百度 swan / QQ qq）逐一注入形态一致的全局对象，
 * 验证：
 *   1. getVendor() 命中正确平台（而非写死 wx）；
 *   2. name 解析 + params 序列化的产物与平台无关；
 *   3. 嵌套路由委托的产物也与平台无关。
 *
 * 各平台导航方法名（navigateTo/redirectTo/reLaunch/switchTab/navigateBack）
 * 及 url/success/fail 约定一致，因此同一个 vendor 形态即可覆盖。
 */
describe('Router platform pass-through (my / tt / swan / qq)', () => {
    const platforms = ['my', 'tt', 'swan', 'qq'];
    const original = {};
    const methods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'];

    function makeVendor() {
        // 与 test/vendor.js 同形态：同步触发 success，使 delegate 的 Promise resolve
        const successFn = () => jest.fn(opt => {
            if (opt && opt.success) opt.success();
        });
        return methods.reduce((v, t) => {
            v[t] = successFn();
            return v;
        }, {});
    }

    beforeAll(() => platforms.forEach(p => {
        original[p] = global[p];
    }));
    afterAll(() => platforms.forEach(p => {
        if (original[p] === undefined) {
            delete global[p];
        } else {
            global[p] = original[p];
        }
    }));

    beforeEach(() => {
        // 清掉所有平台全局，避免探测链优先级（wx > my > tt > swan > qq）
        // 让前一个用例残留的全局影响当前用例的命中结果
        ['wx', ...platforms].forEach(p => delete global[p]);
    });

    platforms.forEach(p => {
        it(`${p}: getVendor 命中 ${p} 全局并透传 navigateTo`, done => {
            const vendor = makeVendor();
            global[p] = vendor;

            const router = new Router({basePath: '/pages', routes: ['home']});
            expect(router.getVendor()).toBe(vendor);

            router.navigateTo({name: 'home', params: {a: 100, b: 200}}).then(() => {
                expect(vendor.navigateTo).toHaveBeenCalledTimes(1);
                expect(vendor.navigateTo.mock.calls[0][0].url)
                    .toEqual('/pages/home/index?a=100&b=200');
                done();
            });
        });

        it(`${p}: 透传调用方自带 success/fail 回调`, done => {
            const vendor = makeVendor();
            global[p] = vendor;

            const router = new Router({basePath: '/pages', routes: ['home']});
            const onSuccess = jest.fn();
            router.navigateTo({name: 'home', success: onSuccess}).then(() => {
                expect(onSuccess).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    // 嵌套路由委托：产物平台无关，仅依赖 basePath 拼接
    it('my: 嵌套路由委托产物与平台无关', done => {
        const vendor = makeVendor();
        global.my = vendor;

        const child = new Router({basePath: '/child', routes: ['foo']});
        const parent = new Router({basePath: '/', routes: []}).use('c', child);

        parent.navigateTo({name: ['c', 'foo'], params: {x: 2}}).then(() => {
            expect(vendor.navigateTo.mock.calls[0][0].url)
                .toEqual('/child/foo/index?x=2');
            done();
        });
    });

    // url 纯透传分支不触碰平台差异
    it('tt: url 分支原样透传', done => {
        const vendor = makeVendor();
        global.tt = vendor;

        const router = new Router({basePath: '/pages', routes: ['home']});
        router.navigateTo({url: '/anywhere?k=v'}).then(() => {
            expect(vendor.navigateTo.mock.calls[0][0].url).toEqual('/anywhere?k=v');
            done();
        });
    });
});
