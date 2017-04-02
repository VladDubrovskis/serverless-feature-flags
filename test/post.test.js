const assert = require('assert');
const post = require('../src/api/post.js');
const isEmptyObject = require('../src/lib/is-empty-object');
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
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));

        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(true);

        return post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 201);
          assert.equal(callback.firstCall.args[1].body, 'OK');
        });
    });

    it('should return 400 when there is no payload', () => {
        const callback = sandbox.stub();
        const event = {
            noBody: JSON.stringify({"featureName": "test1", "state": false})
        };

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 400);
          assert.equal(callback.firstCall.args[1].body, 'Invalid request');
        });
    });

    it('should return 500 when DynamoDB put method fails', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.reject('Put method error'));
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(true);

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Put method error"');
        });
    });

    it('should return 500 when DynamoDB get method fails', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.reject('Get method error'));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Get method error"');
        });
    });

    it('should return 409 when DynamoDB get method find a feature flag entry', () => {
        const callback = sandbox.stub();
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({ Item: { featureName: 'featureName', state: false } }));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };
        sandbox.stub(isEmptyObject, 'check').returns(false);

        return post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 409);
          assert.equal(callback.firstCall.args[1].body, '"Feature flag already exists"');
        });
    });


});
