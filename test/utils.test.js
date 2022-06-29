const constants = require('../src/others/constants');
const { replaceAll,
    setBodyResponse,
    setErrorResponse,
    areAnyUndefined,
    invalidFieldFormat, 
    getToGateway,
    postToGateway} = require("../src/others/utils");
const ResponseMock = require("./mocks/ResponseMock");
const rewire = require("rewire");
const assert = require('assert');
const {DateMock} = require("./mocks/DateMock");
const sinon = require('sinon');
const fetchMock = require('fetch-mock');
const nock = require('nock');



describe('Utils', function() {

    it('replaceAll works', async function () {
        assert.strictEqual(replaceAll('$2b$/Q/hola.',
            "/",
            "a"),
            '$2b$aQahola.');
    });

    it('setResponse mock', async function () {
        let res = new ResponseMock();

        setBodyResponse("",
            200,
            res);

        assert.strictEqual(res.getStatus(), 200);
    });

    it('setErrorResponse mock', async function () {
        let res = new ResponseMock();

        setErrorResponse("",
            401,
            res);

        assert.strictEqual(res.getStatus(), 401);
    });

    it('getId', () => {
        const utilsFile = rewire("../src/others/utils");

        utilsFile.__set__('getHashOf',
            () => '123');

        assert.strictEqual(utilsFile.getId(), '123');
    });

    it('getHashOf', () => {
        const utilsFile = rewire("../src/others/utils");

        utilsFile.__set__('replaceAll',
                         () => '1234');

        assert.strictEqual(utilsFile.getHashOf("a"), '1234');
    });

    it('getBcryptOf', () => {
        const utilsFile = rewire("../src/others/utils");

        utilsFile.__set__('bcrypt.genSaltSync',
            () => '222');

        utilsFile.__set__('bcrypt.hashSync',
            () => '222');

        assert.strictEqual(utilsFile.getBcryptOf("a"), '222');
    });

    it('getDate', () => {
        const utilsFile = rewire("../src/others/utils");

        utilsFile.__set__({
            'Date': DateMock
        });

        assert.strictEqual(utilsFile.getDate(),
                          '222T');
    });

    it('areAnyUndefined', () => {
        assert.strictEqual(areAnyUndefined(["", "a"]), true);
        assert.strictEqual(areAnyUndefined(["a", "b"]), false);
    });

    it('invalidFieldFormat', ()=>{
        assert.strictEqual(invalidFieldFormat('email@email.com', 'password'), true);
        assert.strictEqual(invalidFieldFormat('email.com', 'password123'), true);
        assert.strictEqual(invalidFieldFormat('email@email.com', 'password123'), false);
    });

    it('postToGateway first POST throw error', async ()=>{
        var scope = nock(constants.SERVICES_HOST)
            .persist()
            .post(constants.CHECK_URL)
            .reply(400, 
                {
                    error: 'gateway error',
                })
        
        const body = {
            redirectTo: 'http://url:4480/someservice',
            data: 'some data',
        };
        
        const res = await postToGateway(body);

        assert.strictEqual(res.error, 'gateway error');

        nock.cleanAll();
    });

    it('postToGateway first POST ok, second POST throw error', async ()=>{
        var scopeGateway = nock(constants.SERVICES_HOST)
            .persist()
            .post(constants.CHECK_URL)
            .reply(200, 
                {
                    message: 'some message 1',
                });

        var scopeService = nock('http://url:4480')
            .persist()
            .post('/someservice')
            .reply(400, 
                {
                    error: 'service error',
                })
        
        const body = {
            redirectTo: 'http://url:4480/someservice',
            data: 'some data',
        };
        
        const res = await postToGateway(body);

        assert.strictEqual(res.error, 'service error');

        nock.cleanAll();
    });

    it('getToGateway first POST throw error', async ()=>{
        var scope = nock(constants.SERVICES_HOST)
            .persist()
            .post(constants.CHECK_URL)
            .reply(400, 
                {
                    error: 'gateway error',
                })
        
        const res = await getToGateway('http://url:4480/someservice');

        assert.strictEqual(res.error, 'gateway error');

        nock.cleanAll();
    });

    it('getToGateway first POST ok, first GET throw error', async ()=>{
        var scopeGateway = nock(constants.SERVICES_HOST)
            .persist()
            .post(constants.CHECK_URL)
            .reply(200, 
                {
                    message: 'some message 1',
                });

        var scopeService = nock('http://url:4480')
            .persist()
            .get('/someservice')
            .reply(400, 
                {
                    error: 'service error',
                })

        
        const res = await getToGateway('http://url:4480/someservice');

        assert.strictEqual(res.error, 'service error');

        nock.cleanAll();
    });

} );