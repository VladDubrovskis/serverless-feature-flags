const assert = require('assert');
const put = require('../src/api/put.js');
const sinon = require('sinon');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');

let sandbox;

describe('Feature flags PUT endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use generic handler and pass the storage.update as method', () => {
    const callback = sandbox.stub();
    const handlerStub = sandbox.stub(handler, 'execute').returns(Promise.resolve());
    const context = { context: 1 };
    const event = {};
    return put.handler(event, context, callback).then(() => {
      assert(handlerStub.calledWith(storage.update, event, context), true);
      assert.equal(callback.callCount, 1);
    });
  });

  it('should invoke callback then the handler rejects', () => {
      const callback = sandbox.stub();
      const handlerStub = sandbox.stub(handler, 'execute').returns(Promise.reject());
      const context = { context: 1 };
      const event = {};
      return put.handler(event, context, callback).catch(() => {
          assert(handlerStub.calledWith(storage.update, event, context), true);
          assert.equal(callback.callCount, 1);
      });
  });
});
