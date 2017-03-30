const assert = require('assert');
const put = require('../src/api/put.js');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');

describe('Feature flags PUT endpoint', () => {

  afterEach(() => {
    AWS.restore();
  });

  it('should return 400 when there is no payload', () => {
      const callback = sinon.stub();
      const event = {
          noBody: JSON.stringify({"featureName": "test1", "state": true})
      };

      return put.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 400);
        assert.equal(callback.firstCall.args[1].body, 'Invalid request');
      });
  });

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sinon.stub();
    const event = {
        body: JSON.stringify({"featureName": "test1", "state": true})
    };
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    return put.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
      assert.equal(callback.firstCall.args[1].body, "Not Found");
    });
  });
});
