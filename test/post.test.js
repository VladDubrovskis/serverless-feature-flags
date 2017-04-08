const assert = require('assert');
const post = require('../src/api/post.js');
const isEmptyObject = require('../src/lib/is-empty-object');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
let sandbox;
describe('Feature flags POST endpoint', () => {

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      AWS.restore();
      sandbox.restore();
    });

    it('should return 201 when payload is correct and item is not in DynamoDB', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve());

        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(true);
        sandbox.stub(isValidRequest, 'validate').returns(true);

        return post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 201);
          assert.equal(callback.firstCall.args[1].body, 'OK');
        });
    });

    it('should return 500 when DynamoDB put method fails', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.reject('Put method error'));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(true);
        sandbox.stub(isValidRequest, 'validate').returns(true);

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Put method error"');
        });
    });

    it('should return 409 when feature flag is already in DynamoDB', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.reject({
          "message": "The conditional request failed",
          "code": "ConditionalCheckFailedException",
          "time": "2017-04-08T08:39:18.125Z",
          "requestId": "DFBVF8C8908V3RTLCVJ49DPSUNVV4KQNSO5AEMVJF66Q9ASUAAJG",
          "statusCode": 400,
          "retryable": false,
          "retryDelay": 0
        }));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(false);
        sandbox.stub(isValidRequest, 'validate').returns(true);

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 409);
        });
    });


    it(`should return 400 when the payload is invalid`, () => {
      const callback = sandbox.stub();
      sandbox.stub(isValidRequest, 'validate').returns(false);
      return post.handler({}, undefined, callback).catch(() => {
        assert.equal(callback.firstCall.args[1].statusCode, 400);
        assert.equal(callback.firstCall.args[1].body, 'Invalid request');
      });
    });



});
