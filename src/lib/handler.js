const isValidRequest = require('../lib/is-valid-request');
const responseTransform = require('../lib/response-transform');

module.exports = (method, event, context, statusCode = 204, errorCodeMapping = {}) => {
  let responseStatusCode = statusCode;
  const httpMethod = event.httpMethod;
  const payload = httpMethod !== 'GET' ? isValidRequest(event.body) : '';
  if (payload === false) {
    return new Promise((resolve, reject) => {
      reject({
        statusCode: 400,
        body: {
          error: {
            code: 400,
            message: 'Invalid request',
          },
        },
      });
    });
  }

  return new Promise((resolve, reject) => {
    method(payload)
        .then((responseData) => {
          const response = {
            statusCode,
          };

          if (httpMethod === 'GET') {
            response.body = JSON.stringify(responseTransform(responseData.Items));
          }
          resolve(response);
        })
        .catch((err) => {
          responseStatusCode = (err && err.statusCode) ? errorCodeMapping[err.statusCode] : 500;

          reject({
            statusCode: responseStatusCode,
            body: JSON.stringify({
              error: {
                code: responseStatusCode,
                message: err,
              },
            }),
          });
        });
  });
};
