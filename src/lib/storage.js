const aws = require('aws-sdk');

const dynamoTableName = 'featureFlags';

module.exports = {
  get: () => {
    const params = {
      TableName: dynamoTableName,
    };

    const docClient = new aws.DynamoDB.DocumentClient();
    return docClient.scan(params).promise();
  },
  put: ({ featureName, state }) => {
    const newItemParams = {
      TableName: dynamoTableName,
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
  update: ({ featureName, state }) => {
    const updateItemParams = {
      TableName: dynamoTableName,
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
  delete: ({ featureName }) => {
    const itemParams = {
      TableName: dynamoTableName,
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
    return docClient.delete(itemParams).promise();
  },
};
