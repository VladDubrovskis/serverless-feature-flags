const assert = require('assert');
const put = require('../src/api/put.js');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');

describe('Feature flags PUT endpoint', () => {

  afterEach(() => {
    AWS.restore();
  });

  it('should return 501', () => {
    const callback = sinon.stub();
    return put.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 501);
    });
  });

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sinon.stub();
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    return put.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
      assert.equal(callback.firstCall.args[1].body, "'Not Found'");
    });
  });
});
