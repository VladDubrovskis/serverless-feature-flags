const aws = require('aws-sdk');

module.exports = {
  get: () => {
    const params = {
      TableName: 'featureFlags',
    };

    const docClient = new aws.DynamoDB.DocumentClient();
    return docClient.scan(params).promise();
  },
  put: (featureName, state) => {
    const newItemParams = {
      TableName: 'featureFlags',
      Item: {
        featureName,
        state,
      },
      Expected: {
        featureName: {
          Exists: false,
        },
      },
    };

    const docClient = new aws.DynamoDB.DocumentClient();

    return docClient.put(newItemParams).promise();
  },
  update: (featureName, state) => {
    const updateItemParams = {
      TableName: 'featureFlags',
      Key: {
        featureName,
      },
      AttributeUpdates: {
        state: {
          Action: 'PUT',
          Value: state,
        },
      },
      Expected: {
        featureName: {
          Exists: true,
          Value: featureName,
        },
      },
    };

    const docClient = new aws.DynamoDB.DocumentClient();
    return docClient.update(updateItemParams).promise();
  },
  delete: (featureName) => {
    const itemParams = {
      TableName: 'featureFlags',
      Key: {
        featureName,
      },
      Expected: {
        featureName: {
          Exists: true,
          Value: featureName,
        },
      },
    };
    const docClient = new aws.DynamoDB.DocumentClient();
    return docClient.delete(itemParams).promise()
  },
};
