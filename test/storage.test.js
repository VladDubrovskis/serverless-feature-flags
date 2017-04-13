const assert = require('assert');
const storage = require('../src/lib/storage');

describe('The storage module', () => {
  it('should have get method', (done) => {
    storage.get().then(done);
  });

  it('should have put method', (done) => {
    storage.put().then(done);
  });

  it('should have update method', (done) => {
    storage.update().then(done);
  });

  it('should have delete method', (done) => {
    storage.delete().then(done);
  });
});
