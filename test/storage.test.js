const AWS = require('aws-sdk-mock');
const storage = require('../src/lib/storage');

describe('The storage module', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('should have get method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'scan', Promise.resolve({}));
    storage.get().then(() => {
      expect(dynamoDBMock.stub.calledOnce).toEqual(true);
      done();
    });
  });

  it('should have put method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'put', Promise.resolve({}));
    storage.put({}).then(() => {
      expect(dynamoDBMock.stub.calledOnce).toEqual(true);
      done();
    });
  });

  it('should have update method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'update', Promise.resolve({}));
    storage.update({}).then(() => {
      expect(dynamoDBMock.stub.calledOnce).toEqual(true);
      done();
    });
  });

  it('should have delete method that returns a promise', (done) => {
    const dynamoDBMock = AWS.mock('DynamoDB.DocumentClient', 'delete', Promise.resolve({}));
    storage.delete({}).then(() => {
      expect(dynamoDBMock.stub.calledOnce).toEqual(true);
      done();
    });
  });
});
