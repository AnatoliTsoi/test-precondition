import request from 'supertest';
import app from '../../src/app';

describe('GET/user registered=false returns 200', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/user?registered=false');
        expect(response.status).toBe(200);

        const user = response.body;
        expect(user).toHaveProperty('first_name');
        expect(user).toHaveProperty('last_name');
        expect(user).toHaveProperty('birth_date');
        expect(user).toHaveProperty('gender');
        expect(user).toHaveProperty('address');
        expect(user).toHaveProperty('zip_code');
        expect(user).toHaveProperty('city');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('phone_number');
        expect(user).toHaveProperty('country_code');
        expect(user).toHaveProperty('country');
        expect(user).toHaveProperty('reserved', true);
        expect(user).toHaveProperty('registered', false);
    });
});

describe('PUT/user/unlock changes user state', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app)
            .put('/user/unlock')
            .send({email: "a7b73-8a6d-4320-a87f-ce4e7eb066a1@mailslurp.net"});

        expect(response.status).toBe(204);
    });
});