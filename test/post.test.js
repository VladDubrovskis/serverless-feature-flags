const assert = require('assert');
const post = require('../src/api/post.js');
const sinon = require('sinon');

describe('Feature flags POST endpoint', function() {
  it('should return 200', function() {
    const callback = sinon.stub();
    post.handler(undefined, undefined, callback);
    assert.equal(callback.firstCall.args[1].statusCode, 200);
  });
});
