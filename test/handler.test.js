const assert = require('assert');
const handler = require('../src/lib/handler.js');

describe('Lambda handler', () => {
  it('should return true', (done) => {
    handler.execute().then((result) => {
      assert.equal(result, true);
      done();
    });
  });
});
