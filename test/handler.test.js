const assert = require('assert');
const handler = require('../src/lib/handler.js');
const isValidRequest = require('../src/lib/is-valid-request');
const sinon = require('sinon');

let sandbox;

describe('Lambda handler', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should resolve with a 203 on succesfull call', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(true);
    return handler.execute({}, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 203);
    });
  });

  it('should return 400 when the payload is invalid', () => {
    const callback = sandbox.stub();
    sandbox.stub(isValidRequest, 'validate').returns(false);
    return handler.execute({}, undefined, callback).catch(() => {
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
