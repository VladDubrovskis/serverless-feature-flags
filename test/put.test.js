const assert = require('assert');
const put = require('../src/api/put.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
let sandbox;

describe('Feature flags PUT endpoint', () => {

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    AWS.restore();
    sandbox.restore();
  });

  it('should return 204 when payload is correct and item is found in DynamoDB', () => {
      const callback = sandbox.stub();
      const event = {
          body: JSON.stringify({"featureName": "test1", "state": true})
      };

      AWS.mock('DynamoDB.DocumentClient', 'update', Promise.resolve());
      sandbox.stub(isValidRequest, 'validate').returns(true);

      return put.handler(event, undefined, callback).then(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 204);
      });
  });

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sandbox.stub();
    const event = {
        body: JSON.stringify({"featureName": "test1", "state": true})
    };
    AWS.mock('DynamoDB.DocumentClient', 'update', Promise.reject({
      "message": "The conditional request failed",
      "code": "ConditionalCheckFailedException",
      "time": "2017-04-08T08:39:18.125Z",
      "requestId": "DFBVF8C8908V3RTLCVJ49DPSUNVV4KQNSO5AEMVJF66Q9ASUAAJG",
      "statusCode": 400,
      "retryable": false,
      "retryDelay": 0
    }));
    sandbox.stub(isValidRequest, 'validate').returns(true);

    return put.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
    });
  });

  it('should return 500 when DynamoDB put method fails', () => {
      const callback = sandbox.stub();
      const event = {
          body: JSON.stringify({"featureName": "test1", "state": true})
      };
      AWS.mock('DynamoDB.DocumentClient', 'update', Promise.reject('Put method error'));
      sandbox.stub(isValidRequest, 'validate').returns(true);

      return put.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 500);
        assert.equal(callback.firstCall.args[1].body, '"Put method error"');
      });
  });

  it(`should return 400 when the payload is invalid`, () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return put.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 400);
      assert.equal(callback.firstCall.args[1].body, 'Invalid request');
    });
  });

});
