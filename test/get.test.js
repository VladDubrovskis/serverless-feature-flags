const assert = require('assert');
const get = require('../src/api/get.js');
const sinon = require('sinon');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');

let sandbox;

describe('Feature flags GET endpoint', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use generic handler and pass the storage.put as method', () => {
    const callback = sandbox.stub();
    const handlerStub = sandbox.stub(handler, 'execute').returns(Promise.resolve());
    const context = { context: 1 };
    const event = {};
    return get.handler(event, context, callback).then(() => {
      assert(handlerStub.calledWith(storage.get, event, context, callback), true);
    });
  });
});
