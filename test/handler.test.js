const assert = require('assert');
const handler = require('../handler.js');
const dynamoResponse = require('./mocks/dynamo-response');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');

describe('Feature flags endpoint', function() {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', function(params, callback) {
      callback(null, dynamoResponse);
    });
  })

  it('should return 200 with data from DynamoDB', function() {
    const callback = sinon.stub();
    handler.hello(undefined, undefined, callback);
    assert.equal(callback.firstCall.args[1].statusCode, 200);
    assert.deepEqual(callback.firstCall.args[1].body, dynamoResponse.Items);
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
  })
});
