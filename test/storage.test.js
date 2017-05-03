const AWS = require('aws-sdk-mock');
const storage = require('../src/lib/storage');
const assert = require('assert');

describe('The storage module', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('should have get method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'scan', Promise.resolve({}));
    storage.get().then(() => {
      assert.equal(dynamoDBMock.stub.calledOnce, true);
      done();
    });
  });

  it('should have put method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve({}));
    storage.put({}).then(() => {
      assert.equal(dynamoDBMock.stub.calledOnce, true);
      done();
    });
  });

  it('should have update method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'update', Promise.resolve({}));
    storage.update({}).then(() => {
      assert.equal(dynamoDBMock.stub.calledOnce, true);
      done();
    });
  });

  it('should have delete method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.resolve({}));
    storage.delete({}).then(() => {
      assert.equal(dynamoDBMock.stub.calledOnce, true);
      done();
    });
  });
});
