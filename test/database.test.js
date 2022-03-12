const assert = require('assert');
const constants = require('../src/others/constants');

describe('database tests', function() {
    it('not restarting database', async function() {
        assert.strictEqual(constants.RESET_DATABASE,
                           false);
    });
});
