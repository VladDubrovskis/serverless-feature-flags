const aws = require('aws-sdk');
const isValidRequest = require('../lib/is-valid-request');

module.exports.handler = (event, context, callback) => {
  const payload = isValidRequest.validate(event.body);
  if (payload === false) {
    return new Promise((resolve, reject) => {
      callback(null, {
        statusCode: 400,
        body: 'Invalid request',
      });
      reject('Invalid request');
    });
  }

  const newItem = {
    featureName: payload.featureName,
    state: payload.state,
  };

  const newItemParams = {
    TableName: 'featureFlags',
    Item: newItem,
    Expected: {
      featureName: {
        Exists: false,
      },
    },
  };

  const docClient = new aws.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => docClient.put(newItemParams).promise()
          .then(() => {
            callback(null, {
              statusCode: 201,
              body: 'OK',
            });
            resolve();
          })
          .catch((err) => {
            let statusCode = 500;
            if (err.statusCode && err.statusCode === 400) {
              statusCode = 409;
            }
            callback(null, { statusCode, body: JSON.stringify(err) });
            reject(err);
          }));
};
