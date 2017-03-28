'use strict';

module.exports.handler = (event, context, callback) => {
  return new Promise((resolve, reject) => {
    callback(null, { statusCode: 200, body: "Request succeeded"});
    resolve();
  });
};
