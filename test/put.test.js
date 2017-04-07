const assert = require('assert');
const put = require('../src/api/put.js');
const isEmptyObject = require('../src/lib/is-empty-object');
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

      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({"featureName": "test1", "state": false}));
      AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve());
      sandbox.stub(isEmptyObject, 'check').returns(false);
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
    AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
    sandbox.stub(isEmptyObject, 'check').returns(true);
    sandbox.stub(isValidRequest, 'validate').returns(true);

    return put.handler(event, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
      assert.equal(callback.firstCall.args[1].body, "Not Found");
    });
  });

  it('should return 500 when DynamoDB get method fails', () => {
      const callback = sandbox.stub();
      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.reject('Get method error'));
      const event = {
          body: JSON.stringify({"featureName": "test1", "state": false})
      };
      sandbox.stub(isValidRequest, 'validate').returns(true);
      return put.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 500);
        assert.equal(callback.firstCall.args[1].body, '"Get method error"');
      });
  });

  it('should return 500 when DynamoDB put method fails', () => {
      const callback = sandbox.stub();
      const event = {
          body: JSON.stringify({"featureName": "test1", "state": true})
      };
      AWS.mock('DynamoDB.DocumentClient', 'put', Promise.reject('Put method error'));
      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({"featureName": "test1", "state": false}));
      sandbox.stub(isEmptyObject, 'check').returns(false);
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
