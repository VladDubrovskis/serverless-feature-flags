const assert = require('assert');
const isEmptyObject = require('../src/lib/is-empty-object');

describe('Is empty object method', function() {

    it('should return true for simple empty object', function() {
        assert.equal(isEmptyObject.check({}), true);
    });

    it('should return false for simple object with properies', function() {
        assert.equal(isEmptyObject.check({test: "yes"}), false);
    });

});
