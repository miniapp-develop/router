module.exports = function () {
    // 默认模拟"导航成功"：同步触发 success，使 delegate 的 Promise resolve。
    // 失败场景由具体用例以 mockImplementation 改为调用 fail。
    const successFn = () => jest.fn((opt) => {
        if (opt && opt.success) opt.success();
    });
    return {
        navigateTo: successFn(),
        redirectTo: successFn(),
        navigateBack: successFn(),
        reLaunch: successFn(),
        switchTab: successFn(),
    };
};
