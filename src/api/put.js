'use strict';
const aws = require('aws-sdk');
let payload;

const isEmptyObject = (input) => {
  return Object.keys(input).length === 0 && input.constructor === Object
}

module.exports.handler = (event, context, callback) => {

  try {
      payload = JSON.parse(event.body);
  } catch (e) {
      return new Promise((resolve, reject) => {
        callback(null, {
            "statusCode": 400,
            "body": "Invalid request"
        });
        reject("Invalid request");
      });
  }

  const checkItemParams = {
      "TableName": "featureFlags",
      "Key": {
        "featureName": payload.featureName,
      }
  };
  const docClient = new aws.DynamoDB.DocumentClient();
  
  return new Promise((resolve, reject) => {
    docClient.get(checkItemParams).promise()
      .then((item) => {
        if(isEmptyObject(item)) {
          callback(null, { statusCode: 404, body: "Not Found"});
        } else {
          callback(null, { statusCode: 501, body: "Not Implemented"});
        }
        reject();
      })
  });
};
