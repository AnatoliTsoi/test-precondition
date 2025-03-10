import request from 'supertest';
import app from '../../../src/app'
import {setupDatabase, teardownDatabase} from "../../setUp/setUpDatabase";
import {requestValidationErrorText} from "../../../src/middleware/validate";


beforeAll(async () => {
    await setupDatabase();
});

afterAll(async () => {
    await teardownDatabase();
});

describe('POST /user/registered', () => {
    let userEmail: string;

    it('should register a user and return data of the registered user', async () => {
        const registerResponse = await request(app)
            .post('/user/registered')
            .send({ redCarpetConsent: true });

        expect(registerResponse.status).toBe(201);

        const user = registerResponse.body;
        userEmail = user.email;

        expect(user).toMatchObject({
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
            registered: true,
            member_id: expect.any(String)
        });
    });

    it('should delete the registered user', async () => {
        if (!userEmail) {
            throw new Error("No user email found. Registration test may have failed.");
        }

        const deleteResponse = await request(app)
            .delete(`/user?email=${userEmail}`);

        expect(deleteResponse.status).toBe(204);
    });

    it('should return 400 if redCarpet is not set', async () => {
        const registerResponse = await request(app)
            .post('/user/registered')

        expect(registerResponse.status).toBe(400);
        expect(registerResponse.body.error).toBe(requestValidationErrorText);
    });

    it('should return 400 if email is not set', async () => {
        const deleteResponse = await request(app).delete(`/user?`);
        expect(deleteResponse.status).toBe(400);
        expect(deleteResponse.body.error).toBe(requestValidationErrorText);
    });
});
