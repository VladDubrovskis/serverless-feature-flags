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

  it('should return 500 when DynamoDB delete method fails', () => {
      const callback = sandbox.stub();
      AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.reject('Delete method error'));
      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
      const event = {
          body: JSON.stringify({"featureName": "test1"})
      };
      sandbox.stub(isEmptyObject, 'check').returns(false);

      return deleteFlag.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 500);
        assert.equal(callback.firstCall.args[1].body, '"Delete method error"');
      });
  });

  it('should return 500 when DynamoDB get method fails', () => {
      const callback = sandbox.stub();
      AWS.mock('DynamoDB.DocumentClient', 'get', Promise.reject('Get method error'));
      const event = {
          body: JSON.stringify({"featureName": "test1"})
      };

      return deleteFlag.handler(event, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 500);
        assert.equal(callback.firstCall.args[1].body, '"Get method error"');
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
        return deleteFlag.handler(testCase.event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 400);
          assert.equal(callback.firstCall.args[1].body, 'Invalid request');
        });
    });
  });


});
