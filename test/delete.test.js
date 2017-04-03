const assert = require('assert');
const deleteFlag = require('../src/api/delete.js');
const sinon = require('sinon');

describe('Feature flags DELETE endpoint', () => {
  it('should return 501', () => {
    const callback = sinon.stub();
    return deleteFlag.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 501);
    });
  });

  it('should return 400 when there is no payload', () => {
      const callback = sandbox.stub();
      const event = {
          noBody: JSON.stringify({"featureName": "test1", "state": true})
      };

      return deleteFlag.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 400);
        assert.equal(callback.firstCall.args[1].body, 'Invalid request');
      });
  });
});
