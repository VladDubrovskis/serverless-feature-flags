const assert = require('assert');
const deleteFlag = require('../src/api/delete.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');
const storage = require('../src/lib/storage');

let sandbox;

describe('Feature flags DELETE endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 204 when the item is removed from database', () => {
    const callback = sandbox.stub();
    const payload = { featureName: 'test1', state: false };
    sandbox.stub(isValidRequest, 'validate').returns(payload);
    const storageStub = sandbox.stub(storage, 'delete').returns(Promise.resolve());

    return deleteFlag.handler({}, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
      assert.equal(storageStub.calledWith(payload.featureName), true);
    });
  });

  it('should return 500 when database delete method fails', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'delete').returns(Promise.reject('Delete method error'));

    return deleteFlag.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '{"error":{"code":500,"message":"Delete method error"}}');
    });
  });

  it('should return 404 when the item is not found in database', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(storage, 'delete').returns(Promise.reject({ statusCode: 400 }));

    return deleteFlag.handler({}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
    });
  });

  it('should return 400 when the payload is invalid', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return deleteFlag.handler({}, undefined, callback).catch(() => {
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
