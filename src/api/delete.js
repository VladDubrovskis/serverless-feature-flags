const storage = require('../lib/storage');
const isValidRequest = require('../lib/is-valid-request');

module.exports.handler = (event, context, callback) => {
  const payload = isValidRequest.validate(event.body);
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

  return new Promise((resolve, reject) => storage.delete(payload.featureName)
      .then(() => {
        callback(null, { statusCode: 204 });
        resolve();
      })
      .catch((err) => {
        let statusCode = 500;
        if (err.statusCode && err.statusCode === 400) {
          statusCode = 404;
        }
        callback(null,
          {
            statusCode,
            body: JSON.stringify({
              error: {
                code: statusCode,
                message: err,
              },
            }),
          });
        reject(err);
      }));
};
