'use strict';
const aws = require('aws-sdk');
const responseTransform = require('../lib/response-transform');

module.exports.handler = (event, context, callback) => {
  const params = {
    TableName : 'featureFlags',
  };

  const docClient = new aws.DynamoDB.DocumentClient();
  const response = {
    statusCode: 200
  };



  return new Promise((resolve, reject) => {
    docClient.scan(params).promise()
      .then((data) => {
        response.body = JSON.stringify(responseTransform.transform(data.Items));
        callback(null, response);
        resolve();
      })
      .catch((err) => {
        response.body = JSON.stringify(err);
        response.statusCode = 500;
        callback(null, response);
        reject(err)
      });
  });
};
