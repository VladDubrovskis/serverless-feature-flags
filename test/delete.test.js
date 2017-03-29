const assert = require('assert');
const deleteFlag = require('../src/api/deleteFlag.js');
const sinon = require('sinon');

describe('Feature flags DELETE endpoint', () => {
  it('should return 501', () => {
    const callback = sinon.stub();
    return deleteFlag.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 501);
    });
  });
});
