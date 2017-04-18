const AWS = require('aws-sdk-mock');
const storage = require('../src/lib/storage');

describe('The storage module', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('should have get method that returns a promise', (done) => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', Promise.resolve({}));
    storage.get().then(() => {
      done();
    });
  });

  it('should have put method that returns a promise', (done) => {
    AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve({}));
    storage.put().then(() => {
      done();
    });
  });

  it('should have update method', (done) => {
    storage.update().then(done);
  });

  it('should have delete method', (done) => {
    storage.delete().then(done);
  });
});
