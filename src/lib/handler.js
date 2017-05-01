const isValidRequest = require('../lib/is-valid-request');

module.exports = {
  execute: (method, event, context, callback, statusCode) => {
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

    return new Promise((resolve, reject) => {
      method(event, context, callback)
        .then(() => {
          callback(null, { statusCode });
          resolve();
        })
        .catch((err) => {
          let statusCode = 500;

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
        });
    });
  },
};
