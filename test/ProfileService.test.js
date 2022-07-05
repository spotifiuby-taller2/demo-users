const assert = require('assert');
const sinon = require('sinon');
const rewire = require("rewire");
const ProfileService = rewire("../src/services/ProfileService");
const setErrorResponse = require('../src/others/utils').setErrorResponse;
const setBodyResponse = require('../src/others/utils').setBodyResponse;
const notMonthIntervalYet = require('../src/others/utils').notMonthIntervalYet;
const constants = require('../src/others/constants');
const nock = require('nock');

describe('ProfileService', function() {
    afterEach(function() { return nock.cleanAll(); });
    describe('getProfile',  function() {
        it('get user profile ok (listenner)', async function() {

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
                utils: {setBodyResponse, setErrorResponse},
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

        it('get user profile ok (artist)', async function() {

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
                utils: {setBodyResponse, setErrorResponse},
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

        it('get user profile ok (band)', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

        it('get user profile error user not found', async function() {
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));

            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
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

    });

    describe('updatePhotoUrl', function() {

        it('update photo url ok', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

        it('update photo url user not found error', async function() {
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
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

    describe('getUserBasicInfo', function() {

        it('get user basic info ok', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

        it('get user basic info error user not found', async function() {
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
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

    describe('editProfile', function() {

        it('get user basic info ok, postToPayments not call', async function() {
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

            const updateUsersMock = sinon.fake.returns(Promise.resolve(1));
            const revertRewire = ProfileService.__set__({
                Users: {
                    update: updateUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body,
            };

            await profileService.editProfile(req, res);

            assert(updateUsersMock.calledOnce);
            assert(res.status.calledWith(201));
            assert(jsonMock.json.calledWith(
                {status: 'Perfil del usuario actualizado'}
            ));
            revertRewire();
        });

        it('get user basic info ok, postToPayments call', async function() {
            const profileService = new ProfileService();
            const scope = nock(constants.PAYMENT_HOST)
                .post(constants.DEPOSIT_URL)
                .reply(500,
                    {
                        error: 'payment error',
                    });
            const date = new Date();
            const threeMonthsAgo = date.setMonth(date.getMonth() - 3);
            const dateFixed = new Date(threeMonthsAgo);


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
                        'lastPaymentDate': dateFixed,
                    };

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
                'subscription': 'premium',
                'nMembers': 0,
                'apikey': 'apikey',
                'verbRedirect': 'PATCH',
                'redirectTo': 'url',
            };


            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const revertRewire = ProfileService.__set__({
                Users: {
                    findOne: findOneUsersMock},
                utils: {setBodyResponse, setErrorResponse, notMonthIntervalYet},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body,
            };

            await profileService.editProfile(req, res);

            assert(res.status.calledWith(461));
            assert(jsonMock.json.calledWith(
                {error: 'Error en el servicio de pagos, no se pudo efectuar el cambio de subcripción'}
            ));
            revertRewire();
        });

        it('get user basic info error user not found', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    userId: 1,
                },
                body,
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

    describe('postToPayment',function() {
        it('postToPayment fetch to payments ok', async function() {
            const profileService = new ProfileService();
            const scope = nock(constants.PAYMENT_HOST)
                .post(constants.DEPOSIT_URL)
                .reply(200,
                    {
                        ok: 'ok',
                    });

            const date = new Date();
            const threeMonthsAgo = date.setMonth(date.getMonth() - 3);
            const dateFixed = new Date(threeMonthsAgo);


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
                'lastPaymentDate': dateFixed,
            };

            const userId = 1;

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const revertRewire = ProfileService.__set__({
                utils: {notMonthIntervalYet},
                Users: {
                    findOne: findOneUsersMock,},
              });

            const response = await profileService.postToPayments( userId);

            assert(findOneUsersMock.calledOnce);
            assert.deepStrictEqual(response, {ok: 'ok'});
            revertRewire();
        });

        it('postToPayment fetch not reached for subscription not expired', async function() {
            const profileService = new ProfileService();
            const scope = nock(constants.PAYMENT_HOST)
                .post(constants.DEPOSIT_URL)
                .reply(200,
                    {
                        ok: 'ok',
                    });

            const date = new Date();
            const threeMonthsAgo = date.setDate(date.getDate() - 3);
            const dateFixed = new Date(threeMonthsAgo);


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
                'lastPaymentDate': dateFixed,
            };

            const userId = 1;

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const revertRewire = ProfileService.__set__({
                utils: {notMonthIntervalYet},
                Users: {
                    findOne: findOneUsersMock,},
              });

            const response = await profileService.postToPayments( userId);

            assert(findOneUsersMock.calledOnce);
            assert.deepStrictEqual(response, 0);
            revertRewire();
        });

        it("postToPayment error user don't exist", async function() {
            const profileService = new ProfileService();
            const userId = 1;
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {
                    findOne: findOneUsersMock,},
              });

            const response = await profileService.postToPayments( userId);

            assert(findOneUsersMock.calledOnce);
            assert.deepStrictEqual(response, {error: 'user not exist'});
            revertRewire();
        });

        it("postToPayment error user finding user", async function() {
            const profileService = new ProfileService();
            const userId = 1;
            const findOneUsersMock = sinon.fake.returns(Promise.resolve({error: 'database error'}));
            const revertRewire = ProfileService.__set__({
                Users: {
                    findOne: findOneUsersMock,},
              });

            const response = await profileService.postToPayments( userId);

            assert(findOneUsersMock.calledOnce);
            assert.deepStrictEqual(response, undefined);
            revertRewire();
        });
    })

    describe('setPushNotificationToken', function() {

        it('set user push notification token ok', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

        it('set user push notification token error user not found', async function() {
            const profileService = new ProfileService();
            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
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

        it('set user push notification token error updating user', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

    describe('updateVerificationVideoUrl', function() {

        it('update artist verification video url ok', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

        it('update artist verification video url error user not found', async function() {
            const profileService = new ProfileService();

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(0));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock, update: updateUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
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

        it('update artist verification video url error updating verification video url', async function() {
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
                utils: {setBodyResponse, setErrorResponse},
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

    describe('getUserWithWallet', function() {

        it('get user with wallet ok', async function() {
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
                'walletId': 100,
            };

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(user));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    walletId: 100,
                },
            };

            await profileService.getUserWithWallet(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(200));
            assert(jsonMock.json.calledWith(
                {userId: 1}
            ));
            revertRewire();
        });

        it('get user with wallet error user not found', async function() {
            const profileService = new ProfileService();

            const findOneUsersMock = sinon.fake.returns(Promise.resolve(null));
            const revertRewire = ProfileService.__set__({
                Users: {findOne: findOneUsersMock,},
                utils: {setBodyResponse, setErrorResponse},
              });
            const jsonMock = {json: sinon.fake()};
            const res = {status: sinon.fake.returns(jsonMock)};
            const req = {
                query: {
                    walletId: 100,
                },
            };

            await profileService.getUserWithWallet(req, res);

            assert(findOneUsersMock.calledOnce);
            assert(res.status.calledWith(500));
            assert(jsonMock.json.calledWith(
                {error: 'Usuario no encontrado'}
            ));
            revertRewire();
        });

    });

    describe('checkSuscriptions', function() {

        it('check all suscriptions ok', async function() {
            const profileService = new ProfileService();
            const scope1 = nock(constants.PAYMENT_HOST)
                .post(constants.DEPOSIT_URL, {
                    senderId: 200,
                    amountInEthers: constants.PREMIUN_COST,
                })
                .reply(400,
                    {
                        error: 'saldo insuficiente',
                    });
                

            const scope2 = nock(constants.PAYMENT_HOST)
                .post(constants.DEPOSIT_URL, {
                    senderId: 300,
                    amountInEthers: constants.PREMIUN_COST,
                })
                .reply(200,
                    {
                        ok: 'ok',
                    });
            
            const today = new Date();
            const date1 = new Date(today.setDate(today.getDate() - 1));
            const date2 = new Date(today.setDate(today.getDate() - 90));

            const user1 = {
                'id': 1,
                'email': 'email@email.com',
                'phoneNumber': '11111111',
                'username': 'username1',
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
                'subscription': 'premium',
                'walletId': 100,
                'lastPaymentDate': date1,
                get: args => user1,
            };

            const user2 = {
                'id': 2,
                'email': 'email@email.com',
                'phoneNumber': '22222222',
                'username': 'username2',
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
                'subscription': 'premium',
                'walletId': 200,
                'lastPaymentDate': date2,
                get: args => user2,
            };

            const user3 = {
                'id': 3,
                'email': 'email@email.com',
                'phoneNumber': '33333333',
                'username': 'username3',
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
                'subscription': 'premium',
                'walletId': 300,
                'lastPaymentDate': date2,
                get: args=>user3,
            };

            const users = [user1, user2, user3]

            const findAllUsersMock = sinon.fake.returns(Promise.resolve(users));
            const updateUsersMock = sinon.fake.returns(Promise.resolve(1));
            const revertRewire = ProfileService.__set__({
                Users: {
                    findAll: findAllUsersMock,
                    update: updateUsersMock},
            });

            await profileService.checkSuscriptions();

            assert(findAllUsersMock.calledOnce);
            assert(updateUsersMock.calledTwice);
            assert(updateUsersMock.calledWithMatch(
                {
                    subscription: "free",
                }, 
                {
                    where: {
                       id: user2.id,
                    }
                }));
            assert(updateUsersMock.neverCalledWith(
                {
                    subscription: "free",
                }, 
                {
                    where: {
                       id: user3.id,
                    }
                }));
            revertRewire();
        });
    });
});
