const storage = require('../lib/storage');
const responseTransform = require('../lib/response-transform');

module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
  };


  return new Promise((resolve, reject) => {
    storage.get()
      .then((data) => {
        response.body = JSON.stringify(responseTransform.transform(data.Items));
        callback(null, response);
        resolve();
      })
      .catch((err) => {
        response.body = JSON.stringify(err);
        response.statusCode = 500;
        callback(null, response);
        reject(err);
      });
  });
};
