const aws = require('aws-sdk');

module.exports = {
  get: () => {
    const params = {
      TableName: 'featureFlags',
    };

    const docClient = new aws.DynamoDB.DocumentClient();
    return docClient.scan(params).promise();
  },
  put: () => Promise.resolve(),
  update: () => Promise.resolve(),
  delete: () => Promise.resolve(),
};
