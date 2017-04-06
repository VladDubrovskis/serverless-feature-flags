const assert = require('assert');
const isEmptyRequest = require('../src/lib/is-empty-request');

describe('Is empty request method', function() {

    it('should return true for JSON body', function() {
        assert.equal(isEmptyRequest.check(JSON.stringify({test: 1})), true);
    });

    it('should return false for JSON body', function() {
        assert.equal(isEmptyRequest.check({test: 1}), false);
    });

    it('should return false for empty string body', function() {
        assert.equal(isEmptyRequest.check(''), false);
    });

    it('should return false for undefined', function() {
        assert.equal(isEmptyRequest.check(), false);
    });

    it('should return false for empty object', function() {
        assert.equal(isEmptyRequest.check({}), false);
    });
});
