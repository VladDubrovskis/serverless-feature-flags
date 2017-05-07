const isValidRequest = require('../lib/is-valid-request');
const responseTransform = require('../lib/response-transform');

module.exports = {
  execute: (method, event, context, callback, statusCode = 204, errorCodeMapping = {}) => {
    let responseStatusCode = statusCode;
    const httpMethod = event.httpMethod;
    const payload = httpMethod !== 'GET' ? isValidRequest.validate(event.body) : '';
    if (payload === false) {
      return new Promise((resolve, reject) => {
        callback(null, {
          statusCode: 400,
          body: {
            error: {
              code: 400,
              message: 'Invalid request',
            },
          },
        });
        reject('Invalid request');
      });
    }

    return new Promise((resolve, reject) => {
      method(payload)
        .then((responseData) => {
          const response = {
            statusCode,
          };

          if (httpMethod === 'GET') {
            response.body = JSON.stringify(responseTransform.transform(responseData.Items));
          }

          callback(null, response);
          resolve();
        })
        .catch((err) => {
          responseStatusCode = 500;
          if (err && err.statusCode) {
            responseStatusCode = errorCodeMapping[err.statusCode] || 500;
          }

          callback(null,
            {
              statusCode: responseStatusCode,
              body: JSON.stringify({
                error: {
                  code: responseStatusCode,
                  message: err,
                },
              }),
            });
          reject(err);
        });
    });
  },
};
