    import request from 'supertest';
    import app from '../../src/app';
    import { insertLockedUser, setupDatabase} from '../../src/utils/database';

    const timeout = 20000;

    beforeAll(async () => {
        await setupDatabase();
    });

    describe('GET/user/data', () => {

        it('should respond with a 200 status code', async () => {
            const response = await request(app).get('/user/data');
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

    describe('PATCH/user/unlock', () => {
        beforeEach(async () => {
            await insertLockedUser();
        });

        it('should respond with a 204 status code', async () => {
            const response = await request(app)
                .patch('/user/unlock')
                .send({ email: "integration-tests@test-precondition.se" });

            expect(response.status).toBe(204);
        });
    });

    describe('GET/user/registered', () => {
        it('should respond with a 200 status code', async () => {
            const registerResponse = await request(app)
                .get('/user/registered?redCarpetConsent=true')

            expect(registerResponse.status).toBe(200);

            const user = registerResponse.body;
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
            expect(user).toHaveProperty('registered', true);

            const deleteResponse = await request(app)
                .delete(`/user?email=${user.email}`)

            expect(deleteResponse.status).toBe(204);
        }, timeout);
    });