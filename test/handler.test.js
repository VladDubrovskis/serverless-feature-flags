const assert = require('assert');
const handler = require('../src/lib/handler.js');
const isValidRequest = require('../src/lib/is-valid-request');
const responseTransform = require('../src/lib/response-transform');
const sinon = require('sinon');

let sandbox;

describe('Lambda handler', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should resolve with a 204 on successful call by default if no success status code has been passed', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    const callback = sandbox.stub();
    const payload = { featureName: 1, state: 2 };
    sandbox.stub(isValidRequest, 'validate').returns(payload);
    return handler.execute(method, payload, undefined, callback, 204).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
      assert.equal(method.calledWith(payload), true);
    });
  });

  it('should resolve with a 203 on successful call', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, callback, 203).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 203);
    });
  });

  it('should resolve with any code passed on successful call', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, callback, 301).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 301);
    });
  });

  it('should resolve with a 500 on failed call', () => {
    const method = sandbox.stub().returns(Promise.reject());
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
    });
  });

  it('should support error response mapping. e.g. 400 to 404', () => {
    const method = sandbox.stub().returns(Promise.reject({ statusCode: 400 }));
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, callback, 204, { 400: 404 }).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 404);
    });
  });

  it('should not run the payload validation on GET request', () => {
    const method = sandbox.stub().returns(Promise.resolve({ Items: {} }));
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'GET' }, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
      assert.equal(isValidRequest.validate.callCount, 0);
    });
  });

  it('should run the payload validation on other http requests', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, { httpMethod: 'ANY' }, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 204);
      assert.equal(isValidRequest.validate.callCount, 1);
    });
  });

  it('should return 400 when the payload is invalid on other requests', () => {
    const method = sandbox.stub();
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return handler.execute(method, {}, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 400);
      assert.deepEqual(callback.firstCall.args[1].body, {
        error: {
          code: 400,
          message: 'Invalid request',
        },
      });
    });
  });

  it('should run the response transform on the GET request', () => {
    const method = sandbox.stub().returns(Promise.resolve({ Items: {} }));
    const callback = sandbox.stub();
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'GET' }, undefined, callback, 200).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 200);
      assert.equal(responseTransform.transform.callCount, 1);
    });
  });

  it('should not run the response transform on the non-GET requests', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'ANY' }, undefined, callback, 200).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 200);
      assert.equal(responseTransform.transform.callCount, 0);
    });
  });
});
