const assert = require('assert');
const put = require('../src/api/put.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const storage = require('../src/lib/storage');

let sandbox;

describe('Feature flags PUT endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 204 when payload is correct and item is found in database', () => {
    const callback = sandbox.stub();
    const payload = { featureName: 'test1', state: false };
    sandbox.stub(isValidRequest, 'validate').returns(payload);
    const storageStub = sandbox.stub(storage, 'update').returns(Promise.resolve());

    return put.handler({}, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
      assert.equal(storageStub.calledWith(payload.featureName, payload.state), true);
    });
  });

  it('should return 404 when the item is not found in database', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'update').returns(Promise.reject({ statusCode: 400 }));

    return put.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
    });
  });

  it('should return 500 when database update method fails', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'update').returns(Promise.reject('Update method error'));

    return put.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '{"error":{"code":500,"message":"Update method error"}}');
    });
  });

  it('should return 400 when the payload is invalid', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return put.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 400);
      assert.deepEqual(callback.firstCall.args[1].body, {
        error: {
          code: 400,
          message: 'Invalid request',
        },
      });
    });
  });
});
