const assert = require('assert');
const post = require('../src/api/post.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const storage = require('../src/lib/storage');

let sandbox;

describe('Feature flags POST endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 201 when payload is correct and item is not in database', () => {
    const callback = sandbox.stub();
    const payload = { featureName: 'test1', state: false };
    sandbox.stub(isValidRequest, 'validate').returns(payload);
    const storageStub = sandbox.stub(storage, 'put').returns(Promise.resolve());

    return post.handler({}, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 201);
      assert.equal(callback.firstCall.args[1].body, 'OK');
      assert.equal(storageStub.calledWith(payload.featureName, payload.state), true);
    });
  });

  it('should return 500 when database put method fails', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'put').returns(Promise.reject('Put method error'));

    return post.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '"Put method error"');
    });
  });

  it('should return 409 when feature flag is already in database', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'put').returns(Promise.reject({ statusCode: 400 }));

    return post.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 409);
    });
  });


  it('should return 400 when the payload is invalid', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return post.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 400);
      assert.equal(callback.firstCall.args[1].body, 'Invalid request');
    });
  });
});
