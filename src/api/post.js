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
              statusCode: 500,
              body: "Invalid request"
          });
          reject("Invalid request");
        });
    }

    const newItem = {
        "featureName": payload.featureName,
        "state": payload.state
    };

    const newItemParams = {
        "TableName": 'featureFlags',
        "Item": newItem
    };

    const checkItemParams = {
        "TableName": 'featureFlags',
        "Key": {
          "featureName": payload.featureName,
        }
    };

    const docClient = new aws.DynamoDB.DocumentClient();


    return new Promise((resolve, reject) => {
      docClient.get(checkItemParams).promise()
        .then((item) => {
          if(isEmptyObject(item)) {
            docClient.put(newItemParams).promise()
              .then(() => {
                  callback(null, {
                      statusCode: 200,
                      body: "OK"
                  });
                  resolve();
              })
              .catch((err) => {
                  callback(null, {
                      statusCode: 500,
                      body: JSON.stringify(err)
                  });
                  reject(err);
              });
          } else {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify("Feature flag already exists")
            });
            reject("Feature flag already exists")
          }
        })
        .catch((err) => {
          callback(null, {
              statusCode: 500,
              body: JSON.stringify(err)
          });
          reject(err)
        });

    });

};
