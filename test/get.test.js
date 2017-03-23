const assert = require('assert');
const get = require('../src/api/get.js');
const dynamoResponse = require('./mocks/dynamo-response');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const responseTransform = require('../src/lib/response-transform');

describe('Feature flags GET endpoint', () => {
  let responseTransformResponse;
  let responseTransformStub;

  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', dynamoResponse);

    responseTransformResponse = {
        "test2": true,
        "test": false
    };

    responseTransformStub = sinon.stub(responseTransform, 'transform').returns(responseTransformResponse);
  })

  it('should return 200 with data from DynamoDB', (done) => {
    const callback = sinon.stub();
    get.handler(undefined, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 200);
      assert.equal(responseTransformStub.callCount, 1);
      assert.equal(callback.firstCall.args[1].body, JSON.stringify(responseTransformResponse));
      done();
    });
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
    responseTransformStub.reset();
  })
});
