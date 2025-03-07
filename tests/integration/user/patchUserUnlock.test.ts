import request from 'supertest';
import app from '../../../src/app';
import {insertLockedUser, reservedUser, setupDatabase, teardownDatabase} from "../../setUp/setUpDatabase";
import { knex } from "../../../src/models/db";


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
            .send({ email: reservedUser.email });

        expect(response.status).toBe(204);

        const afterUnlock = await knex("users").where({ email: reservedUser.email }).first();
        expect(afterUnlock.reserved).toBe(false);
    });
});
