const assert = require('assert');
const deleteFlag = require('../src/api/delete.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');

let sandbox;

describe('Feature flags DELETE endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    AWS.restore();
  });

  it('should return 204 when the item is removed from DynamoDB', () => {
    const callback = sinon.stub();
    const event = {
      body: JSON.stringify({ featureName: 'test1' }),
    };
    AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.resolve({}));
    sandbox.stub(isValidRequest, 'validate').returns(true);

    return deleteFlag.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
    });
  });

  it('should return 500 when DynamoDB delete method fails', () => {
    const callback = sandbox.stub();
    AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.reject('Delete method error'));
    const event = {
      body: JSON.stringify({ featureName: 'test1' }),
    };
    sandbox.stub(isValidRequest, 'validate').returns(true);

    return deleteFlag.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '"Delete method error"');
    });
  });

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sandbox.stub();
    const event = {
      body: JSON.stringify({ featureName: 'test1' }),
    };
    AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.reject({
      message: 'The conditional request failed',
      code: 'ConditionalCheckFailedException',
      time: '2017-04-08T08:39:18.125Z',
      requestId: 'DFBVF8C8908V3RTLCVJ49DPSUNVV4KQNSO5AEMVJF66Q9ASUAAJG',
      statusCode: 400,
      retryable: false,
      retryDelay: 0,
    }));
    sandbox.stub(isValidRequest, 'validate').returns(true);

    return deleteFlag.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
    });
  });

  it('should return 400 when the payload is invalid', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return deleteFlag.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 400);
      assert.equal(callback.firstCall.args[1].body, 'Invalid request');
    });
  });
});
