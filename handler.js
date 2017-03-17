'use strict';
const aws = require('aws-sdk');
const responseTransform = require('./response-transform');

module.exports.hello = (event, context, callback) => {
  const params = {
    TableName : 'featureFlags',
  };
  const docClient = new aws.DynamoDB.DocumentClient();
  const response = {
    statusCode: 200
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      response.body = JSON.stringify(err);
      response.code = 500;
    };
    response.body = responseTransform.transform(data.Items);
    callback(null, response);
  });
};
