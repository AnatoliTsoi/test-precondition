import request from 'supertest';
import app from '../../../src/app';
import {insertLockedUser, setupDatabase, teardownDatabase} from "../../setUp/setUpDatabase";


beforeAll(async () => {
    await setupDatabase();
});

beforeEach(async () => {
    await insertLockedUser();
});

afterAll(async () => {
    await teardownDatabase();
});

describe('PATCH /user/unlock', () => {
    it('should unlock the user and return 204', async () => {
        const response = await request(app)
            .patch('/user/unlock')
            .send({ email: "integration-tests@test-precondition.se" });

        expect(response.status).toBe(204);

        const userResponse = await request(app)
            .get('/user/data?email=integration-tests@test-precondition.se');

        expect(userResponse.body).toMatchObject({ reserved: false });
    });
});
