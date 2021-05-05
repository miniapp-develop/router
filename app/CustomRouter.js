const Router = require('../libs/index');

class CustomRouter extends Router {
    objectToQueryString(params = {}, encode = false) {
        return super.objectToQueryString(params, true);
    }
}

module.exports = CustomRouter;