const assert = require('assert');
const get = require('../src/api/get.js');
const dynamoResponse = require('./mocks/dynamo-response');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const responseTransform = require('../src/lib/response-transform');

describe('Feature flags endpoint', function() {
  let responseTransformResponse;
  let responseTransformStub;

  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', function(params, callback) {
      callback(null, dynamoResponse);
    });

    responseTransformResponse = {
        "test2": true,
        "test": false
    };

    responseTransformStub = sinon.stub(responseTransform, 'transform').returns(responseTransformResponse);
  })

  it('should return 200 with data from DynamoDB', function() {
    const callback = sinon.stub();
    get.handler(undefined, undefined, callback);
    assert.equal(callback.firstCall.args[1].statusCode, 200);
    assert.equal(responseTransformStub.callCount, 1);
    assert.equal(callback.firstCall.args[1].body, JSON.stringify(responseTransformResponse));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
    responseTransformStub.reset();
  })
});
