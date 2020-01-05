const request = require('supertest');
const Anime = require('../src/models/anime.model');
const app = require('../src/server');
const nock = require('nock');
const kitsuResponses = require('./kitsuResponses');
const authResponses = require('./authResponses');
var BASE_API_PATH = "/api/v1";

beforeEach(() => {
    nock('https://kitsu.io')
        .get('/api/edge/anime?sort=popularityRank&page[limit]=10&page[offset]=0')
        .reply(200, kitsuResponses.getAllAnimes)
        .get('/api/edge/anime?sort=popularityRank&page[limit]=10&page[offset]=0&filter[genres]=school')
        .reply(200, kitsuResponses.getAnimesByGenre)
        .get('/api/edge/anime?filter[id]=207')
        .reply(200, kitsuResponses.getAnimeById)
    nock(`http://${process.env.SERVER_IP}:${process.env.GATEWAY_PORT}`)
        .get('/api/v1/auth/me')
        .reply(200, JSON.stringify(authResponses.verifyToken))
});

describe("Get all animes", () => {
    it('Should return a list of 10 animes', (done) => {
        request(app)
            .get(BASE_API_PATH + '/animes')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body.length).toEqual(10)
            })
            .expect(200, done);
    });
});

describe("Get anime by id", () => {
    it('Should return Cardcaptor Sakura anime', (done) => {
        request(app)
            .get(BASE_API_PATH + '/animes/207')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body[0].attributes.titles.en).toBe("Cardcaptor Sakura")
            })
            .expect(200, done);
    });
});

describe("Get anime by genre", () => {
    it('Should return only animes with school genre', (done) => {
        request(app)
            .get(BASE_API_PATH + '/animes?genres=school')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body[0].attributes.titles.en).toBe("My Hero Academia")
                expect(response.body[9].attributes.titles.en).toBe("Food Wars! Shokugeki no Soma")
            })
            .expect(200, done);
    });
});

describe("Get anime by wrong filter", () => {
    it('Should return a list of 10 animes unfiltered', (done) => {
        request(app)
            .get(BASE_API_PATH + '/animes?wrongFilter=wrongFilterValue')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body.length).toEqual(10)
            })
            .expect(200, done);
    });
});

// describe("POST /anime", () => {
//     const anime = new Anime({user_id: '5e079bcf5bcf030fd89f0850', rating: '2', status: 'pending'});
//     let dbInsert;
//     const options = {
//         headers: {
//             'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMDc5YmNmNWJjZjAzMGZkODlmMDg1MCIsImlhdCI6MTU3ODIzNDYzNCwiZXhwIjoxNTc4MzIxMDM0fQ.RrUYr2oOcSVhB61jNK5uZ5xqsNRHvJG2XwsJiZeQdJc'
//         }
//     }
//     beforeEach(() => {
//         dbInsert = jest.spyOn(Anime, "create");
//     });

//     it('Should add a new anime to user list', () => {
//         dbInsert.mockImplementation((anime, callback) => {
//             callback(false);
//         });
//         return request(app).post(BASE_API_PATH + '/user/animes/7442', options).send(anime).then((response) => {
//             expect(response.statusCode).toBe(201);
//             // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
//         });
//     });
// });

// describe("PUT /anime", () => {
//     const userAnimeIds = {user_id:'5e079bcf5bcf030fd89f0850', anime_id: 7442}
//     const updatedAnime = new Anime({user_id: '5e079bcf5bcf030fd89f0850', rating: '4', status: 'pending'});
//     const options = {
//         headers: {
//             'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMDc5YmNmNWJjZjAzMGZkODlmMDg1MCIsImlhdCI6MTU3ODIzNDYzNCwiZXhwIjoxNTc4MzIxMDM0fQ.RrUYr2oOcSVhB61jNK5uZ5xqsNRHvJG2XwsJiZeQdJc'
//         }
//     }
//     let dbUpdate;
//     beforeEach(() => {
//         dbUpdate = jest.spyOn(Anime, "findOneAndUpdate");
//     });

//     it('Should update the anime in the user list', () => {
//         dbUpdate.mockImplementation((userAnimeIds, updatedAnime, callback) => {
//             callback(false);
//         });
//         return request(app).put(BASE_API_PATH + '/user/animes/7442', options).send(updatedAnime).then((response) => {
//             expect(response.statusCode).toBe(200);
//             // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
//         });
//     });
// });

// describe("DELETE /anime", () => {
//     const userAnimeIds = {user_id:'5e079bcf5bcf030fd89f0850', anime_id: 7442}
//     const options = {
//         headers: {
//             'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMDc5YmNmNWJjZjAzMGZkODlmMDg1MCIsImlhdCI6MTU3ODIzNDYzNCwiZXhwIjoxNTc4MzIxMDM0fQ.RrUYr2oOcSVhB61jNK5uZ5xqsNRHvJG2XwsJiZeQdJc'
//         }
//     }
//     let dbDelete;
//     beforeEach(() => {
//         dbDelete = jest.spyOn(Anime, "findOneAndDelete");
//     });

//     it('Should add a new anime to user list', () => {
//         dbDelete.mockImplementation((userAnimeIds, callback) => {
//             callback(userAnimeIds);
//         });
//         return request(app).delete(BASE_API_PATH + '/user/animes/7442', options).send(animeId).then((response) => {
//             expect(response.statusCode).toBe(200);
//             // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
//         });
//     });
// });