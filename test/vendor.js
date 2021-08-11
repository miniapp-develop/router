module.exports = function () {
    return {
        navigateTo: jest.fn(),
        redirectTo: jest.fn(),
        navigateBack: jest.fn(),
        reLaunch: jest.fn()
    };
}