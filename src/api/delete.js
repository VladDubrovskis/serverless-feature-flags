'use strict';

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
  return new Promise((resolve, reject) => {
    callback(null, { statusCode: 501, body: "Not Implemented"});
    reject();
  });
};
