const assert = require('assert');
const post = require('../src/api/post.js');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');

describe('Feature flags POST endpoint', () => {
    afterEach(() => {
      AWS.restore();
    });

    it('should return 201 when payload is correct', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve());
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));

        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 201);
          assert.equal(callback.firstCall.args[1].body, 'OK');
          done();
        });
    });

    it('should return 400 when there is no payload', (done) => {
        const callback = sinon.stub();
        const event = {
            noBody: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 400);
          assert.equal(callback.firstCall.args[1].body, 'Invalid request');
          done();
        });
    });

    it('should return 500 when DynamoDB put method fails', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', Promise.reject('Put method error'));
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({}));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Put method error"');
          done();
        });
    });

    it('should return 500 when DynamoDB get method fails', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.reject('Get method error'));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Get method error"');
          done();
        });
    });

    it('should return 409 when DynamoDB get method find a feature flag entry', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'get', Promise.resolve({ Item: { featureName: 'featureName', state: false } }));
        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).catch(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 409);
          assert.equal(callback.firstCall.args[1].body, '"Feature flag already exists"');
          done();
        });
    });


});
