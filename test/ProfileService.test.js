const assert = require('assert');
const sinon = require('sinon');
const rewire = require("rewire");
const ProfileService = rewire("../src/services/ProfileService");
const setErrorResponse = require('../src/others/utils').setErrorResponse;
const setBodyResponse = require('../src/others/utils').setBodyResponse;
const constants = require('../src/others/constants');

describe('ProfileService', function() {
    describe('getProfile',  ()=>{
        it('get user profile ok (listenner)', async ()=>{

            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const artistBandPair = [{idBand: 123, idArtist: 2}];
            const artistFav = [{idListener: 1, idArtist: 2}, {idListener: 3, idArtist: 2}, {idListener: 4, idArtist: 5}]


            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const findAllArtistsBandsMock = sinon.fake.returns(Promise.resolve(artistBandPair));
            const findArtistFavMock = sinon.fake.returns(Promise.resolve(artistFav));

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
                ArtistsBand: {findAll: findAllArtistsBandsMock},
                ArtistsFav: {findAll: findArtistFavMock},
              });
            
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                }
            }

            await profileService.getProfile(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(findAllArtistsBandsMock.notCalled);
            assert(findArtistFavMock.notCalled);
            assert(res.status.calledWith(200));
            revertRewire();
        });

        it('get user profile ok (artist)', async ()=>{

            const profileService = new ProfileService();
            const user = {
                'id': 2,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
                'isArtist': true,
                'isListener': false,
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const artistBandPair = [{idBand: 123, idArtist: 2}];
            const artistFav = [{idListener: 1, idArtist: 2}, {idListener: 3, idArtist: 2}, {idListener: 4, idArtist: 2}]


            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const findAllArtistsBandsMock = sinon.fake.returns(Promise.resolve(artistBandPair));
            const findArtistFavMock = sinon.fake.returns(Promise.resolve(artistFav))

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
                ArtistsBand: {findAll: findAllArtistsBandsMock},
                ArtistFav: {findAll: findArtistFavMock},
              });
            
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 2,
                }
            }

            await profileService.getProfile(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(findAllArtistsBandsMock.notCalled);
            assert(findArtistFavMock.calledOnce);
            assert(res.status.calledWith(200));
            revertRewire();
        });

        it('get user profile ok (band)', async ()=>{
            const profileService = new ProfileService();
            const user = {
                'id': 123,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
                'isArtist': true,
                'isListener': false,
                'isBand': true,
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const artistBandPair = [{idBand: 123, idArtist: 2}];
            const artistFav = [{idListener: 1, idArtist: 2}, {idListener: 3, idArtist: 2}, {idListener: 4, idArtist: 2}]


            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const findAllArtistsBandsMock = sinon.fake.returns(Promise.resolve(artistBandPair));
            const findArtistFavMock = sinon.fake.returns(Promise.resolve(artistFav))

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
                ArtistsBands: {findAll: findAllArtistsBandsMock},
                ArtistFav: {findAll: findArtistFavMock},
              });
            
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 2,
                }
            }

            await profileService.getProfile(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(findAllArtistsBandsMock.calledOnce);
            assert(findArtistFavMock.calledOnce);
            assert(res.status.calledWith(200));
            revertRewire();
        });

        it('get user profile error user not found', async ()=>{
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                }
            }

            await profileService.getProfile(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(400));
            assert(jsonMock.json.calledWith({
                error: "El usuario no existe."
              }));
            revertRewire();
        });
        //TODO
        /**
        it('get user profile error finding artist followers', async ()=>{
            const profileService = new ProfileService();
            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const findArtistFavMock = sinon.fake.returns(Promise.resolve({error: 'database error'}))

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
                ArtistFav: {findAll: findArtistFavMock},
              });
            
            
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                }
            }

            await profileService.getProfile(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(findArtistFavMock.calledOnce);
            assert(res.status.calledWith(581));
            assert(jsonMock.json.calledWith({
                error: 'database error'}
            ));
            revertRewire();
        });**/



    });

    describe('updatePhotoUrl', ()=>{

        it('update photo url ok', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: {
                    photoURL: 'url',
                },
            }

            await profileService.updatePhotoUrl(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(200));
            assert(jsonMock.json.calledWith({
                status: "Foto de perfil actualizada",
              }));
            revertRewire();        
        });

        it('update photo url user not found error', async ()=>{
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: {
                    photoURL: 'url',
                },
            }

            await profileService.updatePhotoUrl(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(461));
            assert(jsonMock.json.calledWith({
                error: "El usuario no existe.",
              }));
            revertRewire();        
        });
    });

    describe('getUserBasicInfo', ()=>{

        it('get user basic info ok', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
            };

            await profileService.getUserBasicInfo(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(201));
            assert(jsonMock.json.calledWith({
                type: constants.LISTENER,
                username: 'username',
                subscription: 'free',

            }));
            revertRewire();        
        });

        it('get user basic info error user not found', async ()=>{
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
            };

            await profileService.getUserBasicInfo(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(400));
            assert(jsonMock.json.calledWith({
                error: 'No existe el usuario',

            }));
            revertRewire();        
        });
    });

    describe('editProfile', ()=>{

        it('get user basic info ok', async ()=>{
            const profileService = new ProfileService();

            const body = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
                'apikey': 'apikey',
                'verbRedirect': 'PATCH',
                'redirectTo': 'url',
            };

            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: body,
            };

            await profileService.editProfile(req, res);

            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(201));
            assert(jsonMock.json.calledWith(
                {status: 'Perfil del usuario actualizado'}
            ));
            revertRewire();        
        });

        it('get user basic info error user not found', async ()=>{
            const profileService = new ProfileService();
            const body = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
                'apikey': 'apikey',
                'verbRedirect': 'PATCH',
                'redirectTo': 'url',
            };
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'database error'}));
            const revertRewire = ProfileService.__set__({
                Users: {update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: body,
            };

            await profileService.editProfile(req, res);

            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(461));
            assert(jsonMock.json.calledWith(
                {error: "No se pudo editar el perfil del usuario"}
            ));
            revertRewire();        
        });

    });

    describe('setPushNotificationToken', ()=>{

        it('set user push notification token ok', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: {
                    token: 'token',
                },
            };

            await profileService.setPushNotificationToken(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(201));
            assert(jsonMock.json.calledWith(
                {status: 'Push notification token actualizado'}
            ));
            revertRewire();        
        });

        it('set user push notification token error user not found', async ()=>{
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: {
                    token: 'token',
                },
            };

            await profileService.setPushNotificationToken(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.notCalled);
            assert(res.status.calledWith(400));
            assert(jsonMock.json.calledWith(
                {error: 'El usuario no existe.'}
            ));
            revertRewire();        
        });

        it('set user push notification token error updating user', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'error updating user'}));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body: {
                    token: 'token',
                },
            };

            await profileService.setPushNotificationToken(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(500));
            assert(jsonMock.json.calledWith(
                {error: `No se pudo actualizar el push notification token del usuario ${req.query.userId}`}
            ));
            revertRewire();        
        });
    });

    describe('updateVerificationVideoUrl', ()=>{

        it('update artist verification video url ok', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                body: {
                    userId: 1,
                    verificationVideoUrl: 'url',
                },
            };

            await profileService.updateVerificationVideoUrl(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(200));
            assert(jsonMock.json.calledWith(
                {status: 'Video de verificacion actualizado'}
            ));
            revertRewire();        
        });

        it('update artist verification video url error user not found', async ()=>{
            const profileService = new ProfileService();

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                body: {
                    userId: 1,
                    verificationVideoUrl: 'url',
                },
            };

            await profileService.updateVerificationVideoUrl(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.notCalled);
            assert(res.status.calledWith(400));
            assert(jsonMock.json.calledWith(
                {error: 'El usuario no existe.'}
            ));
            revertRewire();        
        });

        it('update artist verification video url error updating verification video url', async ()=>{
            const profileService = new ProfileService();

            const user = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '0123456789',
                'username': 'username',
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
                'photoUrl': 'url',
                'pushNotificationToken': 'token',
                'isVerified': false,
                'verificationVideoUrl': 'url',
                'subscription': 'free',
                'nMembers': 0,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const updateUsersMock = sinon.fake.returns(Promise.resolve({error: 'error updating database'}));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse: setBodyResponse, setErrorResponse: setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                body: {
                    userId: 1,
                    verificationVideoUrl: 'url',
                },
            };

            await profileService.updateVerificationVideoUrl(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(500));
            assert(jsonMock.json.calledWith(
                {error: 'error updating database'}
            ));
            revertRewire();        
        });

    });
});