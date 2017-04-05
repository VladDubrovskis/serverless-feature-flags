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

  it('should return 204 when payload is correct and item is found in DynamoDB', () => {
      const callback = sandbox.stub();
      const event = {
          body: JSON.stringify({"featureName": "test1", "state": true})
      };

      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({"featureName": "test1", "state": false}));
      sandbox.stub(isEmptyObject, 'check').returns(false);
      AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve());

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


      return put.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 500);
        assert.equal(callback.firstCall.args[1].body, '"Put method error"');
      });
  });

  const invalidPayloadTestCases = [
    {
      description: 'Contains no body key',
      event: {}
    },
    {
      description: 'Body is empty string',
      event: {body: ''}
    },
    {
      description: 'Body is empty object',
      event: {body: {}}
    }
  ];

  invalidPayloadTestCases.forEach((testCase) => {
    it(`should return 400 when the payload is invalid - ${testCase.description}`, () => {
        const callback = sandbox.stub();
        return put.handler(testCase.event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 400);
          assert.equal(callback.firstCall.args[1].body, 'Invalid request');
        });
    });
  });

});
