const storage = require('../lib/storage');
const handler = require('../lib/handler');

module.exports.handler = (event, context, callback) =>
  handler(storage.update, event, context, 204, { 400: 404 })
      .then(result => callback(null, result))
      .catch(error => callback(null, error));
