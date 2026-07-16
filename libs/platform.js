/**
 * 平台全局对象探测链。
 *
 * 各小程序平台注入的全局对象名：微信 wx、支付宝 my、抖音 tt、百度 swan、QQ qq。
 * 顺序即探测优先级；运行时这些全局互斥，命中即返回。
 *
 * 使用静态 typeof 检测：对未声明变量返回 'undefined'，不抛 ReferenceError，
 * 因此在 Node 测试环境或平台全局尚未就绪时均可安全调用。
 *
 * 本库只做"增强路由"，不做"统一路由"——这里仅负责找到平台原生的导航对象，
 * 其余 API 差异由调用方透传处理。
 */
function detect() {
    if (typeof wx === 'object' && wx) return wx;
    if (typeof my === 'object' && my) return my;
    if (typeof tt === 'object' && tt) return tt;
    if (typeof swan === 'object' && swan) return swan;
    if (typeof qq === 'object' && qq) return qq;
    return null;
}

module.exports = {detect};
