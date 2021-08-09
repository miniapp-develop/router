const Router = require('../libs/index');

class CustomRouter extends Router {
    getParamString(params = {}, encode = false) {
        return super.getParamString(params, true);
    }
}

module.exports = CustomRouter;