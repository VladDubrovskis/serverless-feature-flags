'use strict';

module.exports.handler = (event, context, callback) => {
  return new Promise((resolve, reject) => {
    callback(null, { statusCode: 501, body: "Not Implemented"});
    reject();
  });
};
