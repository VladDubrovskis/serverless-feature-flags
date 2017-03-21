'use strict';
const aws = require('aws-sdk');
const response = {
  statusCode: 200,
  body: "OK"
};
let payload;

const errorResponse = (callback) => {
  callback(null, {statusCode: 500, body: "Invalid request"});
}

module.exports.handler = (event, context, callback) => {

  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    errorResponse(callback);
  }

  const newItem = {
    "featureName": payload.featureName,
    "state": payload.state
  };

  const params = {
    TableName : 'featureFlags',
    Item: newItem
  };

  const docClient = new aws.DynamoDB.DocumentClient();

  docClient.put(params, (err, data) => {
    if (err) {
      response.body = JSON.stringify(err);
      response.statusCode = 500;
    };
    callback(null, response);
  });
};
