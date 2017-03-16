const assert = require('assert');
const responseTransform = require('../response-transform');

describe('Response transform', function() {

    it('should return the transformed payload that looks like the expected schema', function() {
        const payload = [
          {
            "featureName": "test2",
            "state": "true"
          },
          {
            "featureName": "test",
            "state": "false"
          }
        ];

        const actual = responseTransform(payload);

        const expected = {
            "test2": true,
            "test": false
        };

        assert.deepEqual(actual, expected);
    });

});
