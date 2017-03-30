'use strict';
const aws = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
  return new Promise((resolve, reject) => {
    callback(null, { statusCode: 501, body: "Not Implemented"});
    reject();
  });
};
