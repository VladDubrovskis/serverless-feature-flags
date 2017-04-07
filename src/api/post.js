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

    const newItem = {
        "featureName": payload.featureName,
        "state": payload.state
    };

    const newItemParams = {
        "TableName": "featureFlags",
        "Item": newItem
    };

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
          if(isEmptyObject.check(item)) {
            return docClient.put(newItemParams).promise()
              .then(() => {
                  callback(null, {
                      "statusCode": 201,
                      "body": "OK"
                  });
                  resolve();
              })
          } else {
            callback(null, {
                "statusCode": 409,
                "body": JSON.stringify("Feature flag already exists")
            });
            reject("Feature flag already exists")
          }
        })
        .catch((err) => {
          callback(null, {
              "statusCode": 500,
              "body": JSON.stringify(err)
          });
          reject(err)
        });

    });

};
