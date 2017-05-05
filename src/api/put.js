const storage = require('../lib/storage');
const handler = require('../lib/handler');

module.exports.handler = (event, context, callback) =>
  handler.execute(storage.update, event, context, callback, 204, { 400: 404 });
