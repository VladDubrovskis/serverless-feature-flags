const assert = require('assert');
const put = require('../src/api/put.js');
const sinon = require('sinon');

describe('Feature flags PUT endpoint', function() {
  it('should return 200', function() {
    const callback = sinon.stub();
    put.handler(undefined, undefined, callback);
    assert.equal(callback.firstCall.args[1].statusCode, 200);
  });
});
