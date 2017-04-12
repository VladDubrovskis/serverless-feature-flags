const assert = require('assert');
const isEmptyRequest = require('../src/lib/is-valid-request');

describe('Is empty request method', () => {
  it('should return true for JSON body', () => {
    const input = { test: 1 };
    const output = isEmptyRequest.validate(JSON.stringify(input));
    assert.ok(output);
    assert.deepEqual(input, output);
  });

  it('should return false for JSON body', () => {
    assert.equal(isEmptyRequest.validate({ test: 1 }), false);
  });

  it('should return false for empty string body', () => {
    assert.equal(isEmptyRequest.validate(''), false);
  });

  it('should return false for undefined', () => {
    assert.equal(isEmptyRequest.validate(), false);
  });

  it('should return false for empty object', () => {
    assert.equal(isEmptyRequest.validate({}), false);
  });
});
