'use strict';
const aws = require('aws-sdk');
let payload;

module.exports.handler = (event, context, callback) => {

    try {
        payload = JSON.parse(event.body);
    } catch (e) {
        callback(null, {
            statusCode: 500,
            body: "Invalid request"
        });
    }

    const newItem = {
        "featureName": payload.featureName,
        "state": payload.state
    };

    const params = {
        TableName: 'featureFlags',
        Item: newItem
    };

    const docClient = new aws.DynamoDB.DocumentClient();

    return docClient.put(params).promise().then(() => {
        callback(null, {
            statusCode: 200,
            body: "OK"
        });
    }).catch((err) => {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        });
    });
};
