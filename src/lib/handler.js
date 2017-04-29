const isValidRequest = require('../lib/is-valid-request');

module.exports = {
  execute: (method, event, context, callback) => {
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

    return new Promise((resolve) => {
      method(event, context, callback)
        .then(() => {
          callback(null, { statusCode: 203 });
          resolve();
        });
    });
  },
};
