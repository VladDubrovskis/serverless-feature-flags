const assert = require('assert');
const handler = require('../src/lib/handler.js');

describe('Lambda handler', () => {
  it('should return true', () => {
    assert.equal(handler.execute(), true);
  });
});
