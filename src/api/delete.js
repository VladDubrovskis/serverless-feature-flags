'use strict';
const aws = require('aws-sdk');
const isEmptyObject = require('../lib/is-empty-object');
const isValidRequest = require('../lib/is-valid-request');

module.exports.handler = (event, context, callback) => {

  const payload = isValidRequest.validate(event.body);
  if (payload === false) {
    return new Promise((resolve, reject) => {
      callback(null, {
          "statusCode": 400,
          "body": "Invalid request"
      });
      reject("Invalid request");
    });
  }


  const itemParams = {
      "TableName": "featureFlags",
      "Key": {
        "featureName": payload.featureName
      }
  };
  const docClient = new aws.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
    docClient.get(itemParams).promise()
      .then((item) => {
        if(isEmptyObject.check(item)) {
          callback(null, { "statusCode": 404, "body": "Not Found"});
          reject();
        } else {
          return docClient.delete(itemParams).promise()
            .then(() => {
                callback(null, {"statusCode": 204});
                resolve();
            })
        }
      })
      .catch((err) => {
        callback(null, {"statusCode": 500, "body": JSON.stringify(err)});
        reject(err);
      })
  });


};
