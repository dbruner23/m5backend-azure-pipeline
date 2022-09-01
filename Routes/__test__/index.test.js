const app = require('../../app.js');
const request = require('supertest');

describe('regoSearch', function () {
    it('returns status code 200 and car data if valid rego number is passed', async function () {
        const res = await request(app).get('/regosearch/khz762');

        // expect(res.statusCode).toEqual(200);
        expect(res.body.CarMake).toBe('Subaru');
    })

    it('returns bad request if valid rego number is missing', async function () {
        const res = await request(app).get('/regosearch/');

        expect(res.statusCode).toEqual(404);
    })
})