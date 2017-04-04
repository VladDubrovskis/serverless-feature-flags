const assert = require('assert');
const deleteFlag = require('../src/api/delete.js');
const isEmptyObject = require('../src/lib/is-empty-object');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
let sandbox;

describe('Feature flags DELETE endpoint', () => {
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    AWS.restore();
  });

  it('should return 204 when the item is removed from DynamoDB', () => {
    const callback = sinon.stub();
    const event = {
        body: JSON.stringify({"featureName": "test1"})
    };
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.resolve({}));
    sandbox.stub(isEmptyObject, 'check').returns(false);
    return deleteFlag.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
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

  it('should return 404 when the item is not found in DynamoDB', () => {
    const callback = sandbox.stub();
    const event = {
        body: JSON.stringify({"featureName": "test1"})
    };
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    sandbox.stub(isEmptyObject, 'check').returns(true);

    return deleteFlag.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
      assert.equal(callback.firstCall.args[1].body, "Not Found");
    });
  });

});
