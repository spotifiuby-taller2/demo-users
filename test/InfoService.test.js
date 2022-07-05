const assert = require('assert');
const sinon = require('sinon');
const rewire = require("rewire");
const InfoService = rewire("../src/services/InfoService");
const setErrorResponse = require('../src/others/utils').setErrorResponse;
const setBodyResponse = require('../src/others/utils').setBodyResponse;
const constants = require('../src/others/constants');

describe('InfoService', function() {
    describe('getFormattedUsers',  ()=>{
        it('getFormattedUsers ok', ()=>{

            const infoService = new InfoService();
            
            const userOne = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': false,
                        'isListener': true,
                        'isBand': false,
                        'isAdmin': false,
                        'metal': true,
                        'rap': true,
                        'pop': false,
                        'classic': false,
                        'electronic': false,
                        'jazz': false,
                        'reggeaton': false,
                        'indie': false,
                        'punk': false,
                        'salsa': false,
                        'blues': false,
                        'rock': false,
                        'others': false,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 0,
                        'isBlocked': false,
                },
            };

            const userTwo = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const userListExpected = [
                {
                    id: 1,
                    email: 'emailone@email.com',
                    username: 'usernameOne',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: false,
                    isListener: true,
                    isBand: false,
                    isVerified: false,
                    photoUrl: 'urlOne',
                },
                {
                    id: 2,
                    email: 'emailtwo@email.com',
                    username: 'usernameTwo',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: false,
                    isVerified: true,
                    photoUrl: 'urlTwo',
                }
            ]

            const users = [userOne, userTwo];
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};

            const revertRewire = InfoService.__set__({
                utils: {setBodyResponse: setBodyResponse, },
              });

            const response = infoService.getFormattedUsers(users, res);

            assert(res.status.calledWith(200));
            assert(jsonMock.json.calledWith(
                {list: userListExpected}
            ));
            revertRewire(); 
        });
    });

    describe('listUsers',  ()=>{
        it('listUsers ok', async ()=>{

            const infoService = new InfoService();
            
            const userOne = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': false,
                        'isListener': true,
                        'isBand': false,
                        'isAdmin': false,
                        'metal': true,
                        'rap': true,
                        'pop': false,
                        'classic': false,
                        'electronic': false,
                        'jazz': false,
                        'reggeaton': false,
                        'indie': false,
                        'punk': false,
                        'salsa': false,
                        'blues': false,
                        'rock': false,
                        'others': false,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 0,
                        'isBlocked': false,
                },
            };

            const userTwo = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const userListExpected = [
                {
                    id: 1,
                    email: 'emailone@email.com',
                    username: 'usernameOne',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: false,
                    isListener: true,
                    isBand: false,
                    isVerified: false,
                    photoUrl: 'urlOne',
                },
                {
                    id: 2,
                    email: 'emailtwo@email.com',
                    username: 'usernameTwo',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: false,
                    isVerified: true,
                    photoUrl: 'urlTwo',
                }
            ];

            const req = {};

            const users = [userOne, userTwo];
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(users));

            const revertRewire = InfoService.__set__({
                Users: {findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.listUsers(req, res);

            assert(res.status.calledWith(200));
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {list: userListExpected}
            ));
            revertRewire(); 
        });
    });

    describe('listArtists',  ()=>{
        it('listArtists ok', async ()=>{

            const infoService = new InfoService();
            
            const userOne = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const userTwo = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const userListExpected = [
                {
                    id: 1,
                    email: 'emailone@email.com',
                    username: 'usernameOne',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: true,
                    isVerified: false,
                    photoUrl: 'urlOne',
                },
                {
                    id: 2,
                    email: 'emailtwo@email.com',
                    username: 'usernameTwo',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: false,
                    isVerified: true,
                    photoUrl: 'urlTwo',
                }
            ];

            const req = {};

            const users = [userOne, userTwo];
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(users));

            const revertRewire = InfoService.__set__({
                Users: {findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.listArtists(req, res);

            assert(res.status.calledWith(200));
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {list: userListExpected}
            ));
            revertRewire(); 
        });
    });

    describe('listFavArtists',  ()=>{
        it('listFavArtists ok', async ()=>{

            const infoService = new InfoService();
            
            const userOne = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const userTwo = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const req = {
                query: {
                    userId: 3,
                }
                
            };

            const userListExpected = [
                {
                    id: 1,
                    email: 'emailone@email.com',
                    username: 'usernameOne',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: true,
                    isVerified: false,
                    photoUrl: 'urlOne',
                },
                {
                    id: 2,
                    email: 'emailtwo@email.com',
                    username: 'usernameTwo',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: false,
                    isVerified: true,
                    photoUrl: 'urlTwo',
                }
            ]

            const users = [userOne, userTwo];
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(users));

            const revertRewire = InfoService.__set__({
                Users: {findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.listFavArtists(req, res);

            assert(res.status.calledWith(200));
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {list: userListExpected}
            ));
            revertRewire(); 
        });

        it('listFavArtists error finding all artists', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    userId: 3,
                }
                
            };
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findAllUsersMock = sinon.fake.returns(Promise.resolve({error: 'users error'}));

            const revertRewire = InfoService.__set__({
                Users: {findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse,setErrorResponse: setErrorResponse },
              });

            await infoService.listFavArtists(req, res);

            assert(res.status.calledWith(500));
            assert(jsonMock.json.calledWith(
                {error: 'users error'}
            ));
            revertRewire(); 
        });
    });

    describe('listAppUsers',  ()=>{
        it('listAppUsers ok', async ()=>{

            const infoService = new InfoService();
            
            const userOne = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const userTwo = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const userListExpected = [
                {
                    id: 1,
                    email: 'emailone@email.com',
                    username: 'usernameOne',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: true,
                    isVerified: false,
                    photoUrl: 'urlOne',
                },
                {
                    id: 2,
                    email: 'emailtwo@email.com',
                    username: 'usernameTwo',
                    isBlocked: false,
                    isAdmin: false,
                    isArtist: true,
                    isListener: false,
                    isBand: false,
                    isVerified: true,
                    photoUrl: 'urlTwo',
                }
            ];

            const req = {};

            const users = [userOne, userTwo];
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(users));

            const revertRewire = InfoService.__set__({
                Users: {findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.listAppUsers(req, res);

            assert(res.status.calledWith(200));
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {list: userListExpected}
            ));
            revertRewire(); 
        });
    });

    describe('blockUser',  ()=>{
        it('blockUser ok', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.blockUser(req, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {ok: 'ok'}
            ));
            revertRewire(); 
        });

        it('blockUser error finding user', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.blockUser(req, res);

            assert(res.status.calledWith(400));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                {error: 'El usuario no existe'}
            ));
            revertRewire(); 
        });

        it('blockUser error updating user', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'users update error'}));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.blockUser(req, res);

            assert(res.status.calledWith(500));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {error: 'No se pudo actualizar al usuario'}
            ));
            revertRewire(); 
        });
    });

    describe('unlockUser',  ()=>{
        it('unlockUser ok', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.unlockUser(req, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {ok: 'ok'}
            ));
            revertRewire(); 
        });

        it('unlockUser error finding user', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.unlockUser(req, res);

            assert(res.status.calledWith(400));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                {error: 'El usuario no existe'}
            ));
            revertRewire(); 
        });

        it('unlockUser error updating user', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'users update error'}));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.unlockUser(req, res);

            assert(res.status.calledWith(500));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {error: 'No se pudo actualizar al usuario'}
            ));
            revertRewire(); 
        });
    });

    describe('genericVerified',  ()=>{
        it('genericVerified ok', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const userId = 1;
            const verified = true;

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.genericVerified(userId, verified, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {ok: 'ok'}
            ));
            revertRewire(); 
        });

        it('genericVerified error finding user', async ()=>{

            const infoService = new InfoService();

            const userId = 1;
            const verified = true;

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse, },
              });

            await infoService.genericVerified(userId, verified, res);

            assert(res.status.calledWith(400));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                {error: 'El usuario no existe'}
            ));
            revertRewire(); 
        });

        it('genericVerified error updating user', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const userId = 1;
            const verified = true;

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'error updating user'}));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse, },
              });

            await infoService.genericVerified(userId, verified, res);

            assert(res.status.calledWith(500));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {error: 'No se pudo actualizar al usuario'}
            ));
            revertRewire(); 
        });

    });

    describe('unverifiedUser',  ()=>{
        it('unverifiedUser ok', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.unverifiedUser(req, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {ok: 'ok'}
            ));
            revertRewire(); 
        });

    });

    describe('verifiedUser',  ()=>{
        it('verifiedUser ok', async ()=>{

            const infoService = new InfoService();
            
            const user = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': true,
                        'isListener': false,
                        'isBand': true,
                        'isAdmin': false,
                        'metal': null,
                        'rap': null,
                        'pop': null,
                        'classic': null,
                        'electronic': null,
                        'jazz': null,
                        'reggeaton': null,
                        'indie': null,
                        'punk': null,
                        'salsa': null,
                        'blues': null,
                        'rock': null,
                        'others': null,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 2,
                        'isBlocked': false,
                },
            };

            const req = {
                body: {
                    userId: 1,
                }
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.verifiedUser(req, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {ok: 'ok'}
            ));
            revertRewire(); 
        });

    });

    describe('deleteFavArtist',  ()=>{
        it('deleteFavArtist ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idArtist: 1,
                    idListener: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const destroyArtistsFavMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                ArtistFav: {destroy: destroyArtistsFavMock,},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.deleteFavArtist(req, res);

            assert(res.status.calledWith(201));
            assert(destroyArtistsFavMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: "Favorito eliminado" }
            ));
            revertRewire(); 
        });

        it('deleteFavArtist error pair artist-listener not exist', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idArtist: 1,
                    idListener: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const destroyArtistsFavMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                ArtistFav: {destroy: destroyArtistsFavMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.deleteFavArtist(req, res);

            assert(res.status.calledWith(400));
            assert(destroyArtistsFavMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { error: "El par oyente-artista que se quiere eliminar no existe" }
            ));
            revertRewire(); 
        });

    });

    describe('getFavArtist',  ()=>{
        it('getFavArtist ok pair exist', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idArtist: 1,
                    idListener: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneArtistsFavMock = sinon.fake.returns(Promise.resolve({idListener: 2, idArtist: 1}));

            const revertRewire = InfoService.__set__({
                ArtistFav: {findOne: findOneArtistsFavMock,},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.getFavArtist(req, res);

            assert(res.status.calledWith(201));
            assert(findOneArtistsFavMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: true }
            ));
            revertRewire(); 
        });

        it("getFavArtist ok pair don't exist", async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idArtist: 1,
                    idListener: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneArtistsFavMock = sinon.fake.returns(Promise.resolve(null));

            const revertRewire = InfoService.__set__({
                ArtistFav: {findOne: findOneArtistsFavMock,},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.getFavArtist(req, res);

            assert(res.status.calledWith(201));
            assert(findOneArtistsFavMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: false }
            ));
            revertRewire(); 
        });

    });

    describe('deleteNotification',  ()=>{
        it('deleteNotification ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const destroyNotificationMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                Notifications: {destroy: destroyNotificationMock,},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.deleteNotification(req, res);

            assert(res.status.calledWith(201));
            assert(destroyNotificationMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: "Notificación eliminada." }
            ));
            revertRewire(); 
        });

        it("deleteNotification error notification don't exist", async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const destroyNotificationMock = sinon.fake.returns(Promise.resolve(0));

            const revertRewire = InfoService.__set__({
                Notifications: {destroy: destroyNotificationMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.deleteNotification(req, res);

            assert(res.status.calledWith(201));
            assert(destroyNotificationMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: "Notificación no existe." }
            ));
            revertRewire(); 
        });

        it("deleteNotification error deleting notification", async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            }

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const destroyNotificationMock = sinon.fake.returns(Promise.resolve({error: 'notification error'}));

            const revertRewire = InfoService.__set__({
                Notifications: {destroy: destroyNotificationMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.deleteNotification(req, res);

            assert(res.status.calledWith(500));
            assert(destroyNotificationMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { error: "Error al destruir la notificación" }
            ));
            revertRewire(); 
        });

    });

    describe('getNotificationList',  ()=>{
        it('getNotificationList ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                },
            };

            const emissor = {
                'id': 1,
                'email': 'emailone@email.com',
                'phoneNumber': '0123456789',
                'username': 'usernameOne',
                'isArtist': false,
                'isListener': true,
                'isBand': false,
                'isAdmin': false,
                'metal': true,
                'rap': true,
                'pop': false,
                'classic': false,
                'electronic': false,
                'jazz': false,
                'reggeaton': false,
                'indie': false,
                'punk': false,
                'salsa': false,
                'blues': false,
                'rock': false,
                'others': false,
                'photoUrl': 'urlOne',
                'pushNotificationToken': 'tokenOne',
                'isVerified': false,
                'verificationVideoUrl': null,
                'subscription': 'free',
                'nMembers': 0,
                'isBlocked': false,
                'photoUrl': 'photoUrl1'
            };

            const receiver = {
                'id': 2,
                'email': 'emailtwo@email.com',
                'phoneNumber': '0123456789',
                'username': 'usernameTwo',
                'isArtist': false,
                'isListener': true,
                'isBand': false,
                'isAdmin': false,
                'metal': true,
                'rap': true,
                'pop': false,
                'classic': false,
                'electronic': false,
                'jazz': false,
                'reggeaton': false,
                'indie': false,
                'punk': false,
                'salsa': false,
                'blues': false,
                'rock': false,
                'others': false,
                'photoUrl': 'urlOne',
                'pushNotificationToken': 'tokenTwo',
                'isVerified': false,
                'verificationVideoUrl': null,
                'subscription': 'free',
                'nMembers': 0,
                'isBlocked': false,
                'photoUrl': 'photoUrl2',
            };

            const receivers = [receiver];

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(emissor));
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(receivers));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, },
              });

            await infoService.getNotificationList(req, res);

            assert(res.status.calledWith(200));
            assert(findOneUsersMock.calledOnce);
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {
                    notifications: 
                        [
                            {
                                idEmissor: 1,
                                idReceptor: 2,
                                usernameEmissor: 'usernameOne',
                                usernameReceptor: 'usernameTwo',
                                pushNotificationToken: 'tokenTwo',
                                photoUrl: 'photoUrl2'
                            },
                        ]
            }
            ));
            revertRewire(); 
        });

        it('getNotificationList error emissor not found', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                },
            };

            const receiver = {
                'id': 2,
                'email': 'emailtwo@email.com',
                'phoneNumber': '0123456789',
                'username': 'usernameTwo',
                'isArtist': false,
                'isListener': true,
                'isBand': false,
                'isAdmin': false,
                'metal': true,
                'rap': true,
                'pop': false,
                'classic': false,
                'electronic': false,
                'jazz': false,
                'reggeaton': false,
                'indie': false,
                'punk': false,
                'salsa': false,
                'blues': false,
                'rock': false,
                'others': false,
                'photoUrl': 'urlOne',
                'pushNotificationToken': 'tokenTwo',
                'isVerified': false,
                'verificationVideoUrl': null,
                'subscription': 'free',
                'nMembers': 0,
                'isBlocked': false,
            };

            const receivers = [receiver];

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(receivers));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.getNotificationList(req, res);

            assert(res.status.calledWith(471));
            assert(findOneUsersMock.calledOnce);
            assert(findAllUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                { error: 'No existe el emisor'}
            ));
            revertRewire(); 
        });

        it('getNotificationList error notifications not found', async ()=>{

            const infoService = new InfoService();

            const req = {
                query: {
                    idEmissor: 1,
                },
            };

            const emissor = {
                'id': 1,
                'email': 'emailone@email.com',
                'phoneNumber': '0123456789',
                'username': 'usernameOne',
                'isArtist': false,
                'isListener': true,
                'isBand': false,
                'isAdmin': false,
                'metal': true,
                'rap': true,
                'pop': false,
                'classic': false,
                'electronic': false,
                'jazz': false,
                'reggeaton': false,
                'indie': false,
                'punk': false,
                'salsa': false,
                'blues': false,
                'rock': false,
                'others': false,
                'photoUrl': 'urlOne',
                'pushNotificationToken': 'tokenOne',
                'isVerified': false,
                'verificationVideoUrl': null,
                'subscription': 'free',
                'nMembers': 0,
                'isBlocked': false,
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(emissor));
            const findAllUsersMock = sinon.fake.returns(Promise.resolve(null));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUsersMock, findAll: findAllUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.getNotificationList(req, res);

            assert(res.status.calledWith(400));
            assert(findOneUsersMock.calledOnce);
            assert(findAllUsersMock.calledOnce);
            assert(jsonMock.json.calledWith({
                error: 'No se encontraron notificaciones'
            }
            ));
            revertRewire(); 
        });

    });

    describe('addNotification',  ()=>{
        it('addNotification ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createNotificationsMock = sinon.fake.returns(Promise.resolve(1));
            const findOneNotificationsMock = sinon.fake.returns(Promise.resolve(null));

            const revertRewire = InfoService.__set__({
                Notifications: {
                    create: createNotificationsMock,
                    findOne: findOneNotificationsMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addNotification(req, res);

            assert(res.status.calledWith(201));
            assert(createNotificationsMock.calledOnce);
            assert(findOneNotificationsMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: "Notificación creada." }
            ));
            revertRewire(); 
        });

        it('addNotification error creating notification', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createNotificationsMock = sinon.fake.returns(Promise.resolve({error: 'notifications error'}));
            const findOneNotificationsMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = InfoService.__set__({
                Notifications: {
                    create: createNotificationsMock,
                    findOne: findOneNotificationsMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addNotification(req, res);

            assert(res.status.calledWith(400));
            assert(createNotificationsMock.calledOnce);
            assert(findOneNotificationsMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { error: "notifications error" }
            ));
            revertRewire(); 
        });

        it('addNotification already exist', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idEmissor: 1,
                    idReceptor: 2,
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createNotificationsMock = sinon.fake.returns(Promise.resolve({error: 'notifications error'}));
            const findOneNotificationsMock = sinon.fake.returns(Promise.resolve({idEmissor: 1, idReceptor: 2}));
            const revertRewire = InfoService.__set__({
                Notifications: {
                    create: createNotificationsMock,
                    findOne: findOneNotificationsMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addNotification(req, res);

            assert(res.status.calledWith(201));
            assert(createNotificationsMock.notCalled);
            assert(findOneNotificationsMock.calledOnce);
            assert(jsonMock.json.calledWith(
                { status: "Notificación ya existe." }
            ));
            revertRewire(); 
        });

    });

    describe('createAdmin',  ()=>{
        it('createAdmin ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    email: 'email@email.com',
                    password: 'password',
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createUserFirebaseMock = sinon.fake.returns(Promise.resolve({uid: 1}));
            const createUsersMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                auth: {createUser: createUserFirebaseMock,},
                Users: {create: createUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.createAdmin(req, res);

            assert(res.status.calledWith(200));
            assert(createUserFirebaseMock.calledOnce);
            assert(createUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {uid: 1}
            ));
            revertRewire(); 
        });

        it('createAdmin error firebase', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    email: 'email@email.com',
                    password: 'password',
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createUserFirebaseMock = sinon.fake.returns(Promise.resolve({error: 'error creating users'}));
            const createUsersMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                auth: {createUser: createUserFirebaseMock,},
                Users: {create: createUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.createAdmin(req, res);

            assert(res.status.calledWith(500));
            assert(createUserFirebaseMock.calledOnce);
            assert(createUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                {error: 'error creating users'}
            ));
            revertRewire(); 
        });

        it('createAdmin error a params is null', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    email: null,
                    password: 'password',
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createUserFirebaseMock = sinon.fake.returns(Promise.resolve({error: 'error creating users'}));
            const createUsersMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                auth: {createUser: createUserFirebaseMock,},
                Users: {create: createUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.createAdmin(req, res);

            assert(res.status.calledWith(400));
            assert(createUserFirebaseMock.notCalled);
            assert(createUsersMock.notCalled);
            assert(jsonMock.json.calledWith(
                {error: "Error creando administrador. Mail es requerido"}
            ));
            revertRewire(); 
        });

        it('createAdmin error creating user', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    email: 'email@email.com',
                    password: 'password',
                },
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const createUserFirebaseMock = sinon.fake.returns(Promise.resolve({uid: 1}));
            const createUsersMock = sinon.fake.returns(Promise.resolve({error: 'users error'}));

            const revertRewire = InfoService.__set__({
                auth: {createUser: createUserFirebaseMock,},
                Users: {create: createUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.createAdmin(req, res);

            assert(res.status.calledWith(500));
            assert(createUserFirebaseMock.calledOnce);
            assert(createUsersMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {error: 'users error'}
            ));
            revertRewire(); 
        });

    });

    describe('addFavArtist',  ()=>{
        it('addFavArtist ok', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idArtist: 2,
                    idListener: 1,
                },
            };

            const listener = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': false,
                        'isListener': true,
                        'isBand': false,
                        'isAdmin': false,
                        'metal': true,
                        'rap': true,
                        'pop': false,
                        'classic': false,
                        'electronic': false,
                        'jazz': false,
                        'reggeaton': false,
                        'indie': false,
                        'punk': false,
                        'salsa': false,
                        'blues': false,
                        'rock': false,
                        'others': false,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 0,
                        'isBlocked': false,
                },
            };

            const artist = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUserMock = sinon.stub();
            findOneUserMock.onCall(0).returns(Promise.resolve(artist));
            findOneUserMock.onCall(1).returns(Promise.resolve(listener));
            const createArtistFavMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUserMock, },
                ArtistFav: {create: createArtistFavMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addFavArtist(req, res);

            assert(res.status.calledWith(201));
            assert(createArtistFavMock.calledOnce);
            assert(findOneUserMock.calledTwice);
            assert(jsonMock.json.calledWith(
                { status: "Nuevo favorito agregado" }
            ));
            revertRewire(); 
        });

        it('addFavArtist error artist not found', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idArtist: 2,
                    idListener: 1,
                },
            };

            const listener = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': false,
                        'isListener': true,
                        'isBand': false,
                        'isAdmin': false,
                        'metal': true,
                        'rap': true,
                        'pop': false,
                        'classic': false,
                        'electronic': false,
                        'jazz': false,
                        'reggeaton': false,
                        'indie': false,
                        'punk': false,
                        'salsa': false,
                        'blues': false,
                        'rock': false,
                        'others': false,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 0,
                        'isBlocked': false,
                },
            };

            const artist = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUserMock = sinon.stub();
            findOneUserMock.onCall(0).returns(Promise.resolve(null));
            findOneUserMock.onCall(1).returns(Promise.resolve(listener));
            const createArtistFavMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUserMock, },
                ArtistFav: {create: createArtistFavMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addFavArtist(req, res);

            assert(res.status.calledWith(400));
            assert(createArtistFavMock.notCalled);
            assert(findOneUserMock.calledOnce);
            assert(jsonMock.json.calledWith(
                {error: `No existe el artista ${req.body.idArtist}`}
            ));
            revertRewire(); 
        });

        it('addFavArtist error artist not found', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idArtist: 2,
                    idListener: 1,
                },
            };

            const artist = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUserMock = sinon.stub();
            findOneUserMock.onCall(0).returns(Promise.resolve(artist));
            findOneUserMock.onCall(1).returns(Promise.resolve(null));
            const createArtistFavMock = sinon.fake.returns(Promise.resolve(1));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUserMock, },
                ArtistFav: {create: createArtistFavMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addFavArtist(req, res);

            assert(res.status.calledWith(400));
            assert(createArtistFavMock.notCalled);
            assert(findOneUserMock.calledTwice);
            assert(jsonMock.json.calledWith(
                {error: `No existe el oyente ${req.body.idListener}`}
            ));
            revertRewire(); 
        });

        it('addFavArtist error creating pair listener-artist', async ()=>{

            const infoService = new InfoService();

            const req = {
                body: {
                    idArtist: 2,
                    idListener: 1,
                },
            };

            const listener = {
                dataValues: 
                    {
                        'id': 1,
                        'email': 'emailone@email.com',
                        'phoneNumber': '0123456789',
                        'username': 'usernameOne',
                        'isArtist': false,
                        'isListener': true,
                        'isBand': false,
                        'isAdmin': false,
                        'metal': true,
                        'rap': true,
                        'pop': false,
                        'classic': false,
                        'electronic': false,
                        'jazz': false,
                        'reggeaton': false,
                        'indie': false,
                        'punk': false,
                        'salsa': false,
                        'blues': false,
                        'rock': false,
                        'others': false,
                        'photoUrl': 'urlOne',
                        'pushNotificationToken': 'token',
                        'isVerified': false,
                        'verificationVideoUrl': null,
                        'subscription': 'free',
                        'nMembers': 0,
                        'isBlocked': false,
                },
            };

            const artist = {
                dataValues: {
                    'id': 2,
                    'email': 'emailtwo@email.com',
                    'phoneNumber': '9876543210',
                    'username': 'usernameTwo',
                    'isArtist': true,
                    'isListener': false,
                    'isBand': false,
                    'isAdmin': false,
                    'metal': null,
                    'rap': null,
                    'pop': null,
                    'classic': null,
                    'electronic': null,
                    'jazz': null,
                    'reggeaton': null,
                    'indie': null,
                    'punk': null,
                    'salsa': null,
                    'blues': null,
                    'rock': null,
                    'others': null,
                    'photoUrl': 'urlTwo',
                    'pushNotificationToken': 'token',
                    'isVerified': true,
                    'verificationVideoUrl': null,
                    'subscription': 'free',
                    'nMembers': 0,
                    'isBlocked': false,
                },
                
            };

            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const findOneUserMock = sinon.stub();
            findOneUserMock.onCall(0).returns(Promise.resolve(artist));
            findOneUserMock.onCall(1).returns(Promise.resolve(listener));
            const createArtistFavMock = sinon.fake.returns(Promise.resolve({error: 'artistfav error'}));

            const revertRewire = InfoService.__set__({
                Users: {findOne: findOneUserMock, },
                ArtistFav: {create: createArtistFavMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse },
              });

            await infoService.addFavArtist(req, res);

            assert(res.status.calledWith(500));
            assert(createArtistFavMock.calledOnce);
            assert(findOneUserMock.calledTwice);
            assert(jsonMock.json.calledWith(
                { error: "artistfav error" }
            ));
            revertRewire(); 
        });

    });

});