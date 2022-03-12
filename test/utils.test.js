const { replaceAll,
    setBodyResponse,
    setErrorResponse,
    getId } = require("../src/others/utils");
const ResponseMock = require("./mocks/ResponseMock");
const rewire = require("rewire");
const assert = require('assert');

it('replaceAll works', async function() {
    assert.strictEqual( replaceAll( '$2b$/Q/hola.',
                                    "/",
                                    "a"),
                      '$2b$aQahola.');
});

it('setResponse mock', async function() {
    let res = new ResponseMock();

    setBodyResponse(res,
        200,
        "");

    assert.strictEqual( res.getStatus() , 200);
});

it('setErrorResponse mock', async function() {
    let res = new ResponseMock();

    setErrorResponse("",
                    res);

    assert.strictEqual( res.getStatus() , 400);
} );

it('getId', () => {
    const utilsFile = rewire("../src/others/utils");

    utilsFile.__set__('getHashOf',
        () => '123');

    assert.strictEqual( utilsFile.getId() , '123');
} );

it('getHashOf', () => {
    const utilsFile = rewire("../src/others/utils");

    utilsFile.__set__('replaceAll',
        () => '1234');

    assert.strictEqual( utilsFile.getHashOf("a") , '1234');
} );

it('getBcryptOf', () => {
    const utilsFile = rewire("../src/others/utils");

    utilsFile.__set__('bcrypt.genSaltSync',
        () => '222');

    utilsFile.__set__('bcrypt.hashSync',
        () => '222');

    assert.strictEqual( utilsFile.getBcryptOf("a") , '222');
} );