const assert = require('assert');
const put = require('../src/api/put.js');
const sinon = require('sinon');

describe('Feature flags PUT endpoint', () => {
  it('should return 501', () => {
    const callback = sinon.stub();
    return put.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 501);
    });

  });
});
