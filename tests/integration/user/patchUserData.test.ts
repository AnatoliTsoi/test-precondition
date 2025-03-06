import request from 'supertest';
import app from '../../../src/app';
import {setupDatabase, teardownDatabase} from "../../setUp/setUpDatabase";

beforeAll(async () => {
    await setupDatabase();
});

afterAll(async () => {
    await teardownDatabase();
});

describe('PATCH /user/data', () => {
    it('should respond with a 200 status code and user data', async () => {
        const response = await request(app).patch('/user/data');
        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            first_name: expect.any(String),
            last_name: expect.any(String),
            birth_date: expect.any(String),
            gender: expect.any(String),
            address: expect.any(String),
            zip_code: expect.any(String),
            city: expect.any(String),
            password: expect.any(String),
            email: expect.any(String),
            phone_number: expect.any(Number),
            country_code: expect.any(String),
            country: expect.any(String),
            reserved: true,
            registered: false
        });
    });
});
