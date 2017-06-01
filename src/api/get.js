const storage = require('../lib/storage');
const handler = require('../lib/handler');

module.exports.handler = (event, context, callback) =>
    handler(storage.get, event, context, 200)
        .then(result => callback(null, result))
        .catch(error => callback(new Error(error)));
