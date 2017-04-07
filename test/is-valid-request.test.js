const assert = require('assert');
const isEmptyRequest = require('../src/lib/is-valid-request');

describe('Is empty request method', function() {

    it('should return true for JSON body', function() {
        const input = {test: 1};
        const output = isEmptyRequest.validate(JSON.stringify(input));
        assert.ok(output);
        assert.deepEqual(input, output);
    });

    it('should return false for JSON body', function() {
        assert.equal(isEmptyRequest.validate({test: 1}), false);
    });

    it('should return false for empty string body', function() {
        assert.equal(isEmptyRequest.validate(''), false);
    });

    it('should return false for undefined', function() {
        assert.equal(isEmptyRequest.validate(), false);
    });

    it('should return false for empty object', function() {
        assert.equal(isEmptyRequest.validate({}), false);
    });
});
