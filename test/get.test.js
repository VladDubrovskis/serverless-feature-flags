const assert = require('assert');
const get = require('../src/api/get.js');
const sinon = require('sinon');
const storage = require('../src/lib/storage');
const responseTransform = require('../src/lib/response-transform');

let sandbox;

describe('Feature flags GET endpoint', () => {
  let responseTransformResponse;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 200 with data from DynamoDB', () => {
    responseTransformResponse = {
      test2: true,
      test: false,
    };

    sandbox.stub(storage, 'get').returns(Promise.resolve({ Items: {} }));
    sandbox.stub(responseTransform, 'transform').returns(responseTransformResponse);

    const callback = sandbox.stub();
    return get.handler(undefined, undefined, callback).then(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 200);
      assert.equal(callback.firstCall.args[1].body, JSON.stringify(responseTransformResponse));
    });
  });

  it('should return 500 when read from DynamoDB fails', () => {
    const callback = sandbox.stub();
    sandbox.stub(storage, 'get').returns(Promise.reject('Scan method error'));
    return get.handler(undefined, undefined, callback).catch(() => {
      assert.equal(callback.firstCall.args[1].statusCode, 500);
      assert.equal(callback.firstCall.args[1].body, '"Scan method error"');
    });
  });
});
