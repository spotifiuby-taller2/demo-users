const assert = require('assert');
import { replaceAll } from "../src/others/utils";

describe('utils tests', function() {
    it('replaceAll works', async function() {
        assert.strictEqual( replaceAll( '$2b$/Q/hola.',
                                         "/",
                                         "a"),
                            '$2b$aQahola.'
        )
    });

});
