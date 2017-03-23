const assert = require('assert');
const post = require('../src/api/post.js');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');

describe('Feature flags POST endpoint', () => {

    it('should return 200 when payload is correct', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, true);
        });

        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 200);
          assert.equal(callback.firstCall.args[1].body, 'OK');
          done();
        });

        AWS.restore('DynamoDB.DocumentClient');
    });

    it('should return 500 when there is no payload', (done) => {
        const callback = sinon.stub();

        AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, true);
        });

        const event = {
            noBody: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, 'Invalid request');
          done();
        });

        AWS.restore('DynamoDB.DocumentClient');
    });

    it('should return 500 when DynamoDB put method fails', (done) => {
        const callback = sinon.stub();
        AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback('Error', false);
        });

        const event = {
            body: JSON.stringify({"featureName": "test1", "state": false})
        };

        post.handler(event, undefined, callback).then(() => {
          assert.equal(callback.firstCall.args[1].statusCode, 500);
          assert.equal(callback.firstCall.args[1].body, '"Error"');
          done();
        });

        AWS.restore('DynamoDB.DocumentClient');
    });
});
