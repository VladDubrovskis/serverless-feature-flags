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
    const payload = { featureName: 1, state: 2 };
    sandbox.stub(isValidRequest, 'validate').returns(payload);
    return handler.execute(method, payload, undefined, 204).then((result) => {
      assert.equal(result.statusCode, 204);
      assert.equal(method.calledWith(payload), true);
    });
  });

  it('should resolve with a 203 on successful call', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, 203).then((result) => {
      assert.equal(result.statusCode, 203);
    });
  });

  it('should resolve with any code passed on successful call', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, 301).then((result) => {
      assert.equal(result.statusCode, 301);
    });
  });

  it('should resolve with a 500 on failed call', () => {
    const method = sandbox.stub().returns(Promise.reject());
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}).catch((error) => {
      assert.equal(error.statusCode, 500);
    });
  });

  it('should support error response mapping. e.g. 400 to 404', () => {
    const method = sandbox.stub().returns(Promise.reject({ statusCode: 400 }));
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, {}, undefined, 204, { 400: 404 }).catch((error) => {
      assert.equal(error.statusCode, 404);
    });
  });

  it('should not run the payload validation on GET request', () => {
    const method = sandbox.stub().returns(Promise.resolve({ Items: {} }));
    sandbox.stub(isValidRequest, 'validate').returns(false);
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'GET' }).then((result) => {
      assert.equal(result.statusCode, 204);
      assert.equal(isValidRequest.validate.callCount, 0);
    });
  });

  it('should run the payload validation on other http requests', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute(method, { httpMethod: 'ANY' }).then((result) => {
      assert.equal(result.statusCode, 204);
      assert.equal(isValidRequest.validate.callCount, 1);
    });
  });

  it('should return 400 when the payload is invalid on other requests', () => {
    const method = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return handler.execute(method, {}).catch((error) => {
      assert.equal(error.statusCode, 400);
      assert.deepEqual(error.body, {
        error: {
          code: 400,
          message: 'Invalid request',
        },
      });
    });
  });

  it('should run the response transform on the GET request', () => {
    const method = sandbox.stub().returns(Promise.resolve({ Items: {} }));
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'GET' }, undefined, 200).then((result) => {
      assert.equal(result.statusCode, 200);
      assert.equal(responseTransform.transform.callCount, 1);
    });
  });

  it('should not run the response transform on the non-GET requests', () => {
    const method = sandbox.stub().returns(Promise.resolve());
    sandbox.stub(isValidRequest, 'validate').returns(true);
    sandbox.stub(responseTransform, 'transform').returns({});
    return handler.execute(method, { httpMethod: 'ANY' }, undefined, 200).then((result) => {
      assert.equal(result.statusCode, 200);
      assert.equal(responseTransform.transform.callCount, 0);
    });
  });
});
