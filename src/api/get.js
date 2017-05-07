const storage = require('../lib/storage');
const handler = require('../lib/handler');

module.exports.handler = (event, context, callback) =>
    handler.execute(storage.get, event, context, callback, 200);
