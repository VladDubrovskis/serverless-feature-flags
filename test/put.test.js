const assert = require('assert');
const put = require('../src/api/put.js');
const isEmptyObject = require('../src/lib/is-empty-object');
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

  it('should return 400 when there is no payload', () => {
      const callback = sandbox.stub();
      const event = {
          noBody: JSON.stringify({"featureName": "test1", "state": true})
      };

      return put.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 400);
        assert.equal(callback.firstCall.args[1].body, 'Invalid request');
      });
  });

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sandbox.stub();
    const event = {
        body: JSON.stringify({"featureName": "test1", "state": true})
    };
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    sandbox.stub(isEmptyObject, 'check').returns(true);

    return put.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
      assert.equal(callback.firstCall.args[1].body, "Not Found");
    });
  });
});
