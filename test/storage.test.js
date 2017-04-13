const assert = require('assert');
const storage = require('../src/lib/storage');

describe('The storage module', () => {
  it('should have get method', () => {
    assert.equal(storage.get(), true);
  });

  it('should have put method', () => {
    assert.equal(storage.put(), true);
  });

  it('should have update method', () => {
    assert.equal(storage.update(), true);
  });

  it('should have delete method', () => {
    assert.equal(storage.delete(), true);
  });
});
