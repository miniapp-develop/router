global.wx = {
    name:'wx'
};

const vendor = require('../libs/vendor');

describe('vendor', () => {
    it('vendor is wx', () => {
        expect(vendor).toEqual({
            name:'wx'
        });
    });
});