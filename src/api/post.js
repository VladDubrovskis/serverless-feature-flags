const storage = require('../lib/storage');
const handler = require('../lib/handler');

module.exports.handler = (event, context, callback) =>
  handler.execute(storage.put, event, context, callback, 204, { 400: 409 });
