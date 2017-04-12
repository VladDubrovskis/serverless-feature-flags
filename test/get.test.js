const assert = require('assert');
const get = require('../src/api/get.js');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const responseTransform = require('../src/lib/response-transform');

describe('Feature flags GET endpoint', () => {
  let responseTransformResponse;
  let responseTransformStub;

  afterEach(() => {
    AWS.restore();
    responseTransformStub.reset();
  });

  it('should return 200 with data from DynamoDB', () => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', Promise.resolve({}));

    responseTransformResponse = {
      test2: true,
      test: false,
    };

    responseTransformStub = sinon.stub(responseTransform, 'transform').returns(responseTransformResponse);

    const callback = sinon.stub();
    return get.handler(undefined, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 200);
      assert.equal(responseTransformStub.callCount, 1);
      assert.equal(callback.firstCall.args[1].body, JSON.stringify(responseTransformResponse));
    });
  });

  it('should return 500 when read from DynamoDB fails', () => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', Promise.reject('Scan method error'));
    const callback = sinon.stub();
    return get.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '"Scan method error"');
    });
  });
});
