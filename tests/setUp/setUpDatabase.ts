import { knex } from '../../src/models/db';
import { seed } from '../../seeds/seed_users';

const defaultUser = {
    id: 1,
    country_code: '+49',
    phone_number: 123456789,
    email: 'integration-tests@test-precondition.se',
    reserved: false,
    registered: false
};

const reservedUser = {
    id: 2,
    country_code: '+49',
    phone_number: 123456789,
    email: 'integration-tests@test-precondition.se',
    reserved: true,
    registered: false
};

export async function setupDatabase(): Promise<void> {
    await knex('users').del();
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await seed(knex);
}

export async function insertLockedUser(): Promise<void> {
    await knex('users').insert(reservedUser);
}

export async function teardownDatabase(): Promise<void> {
    await knex('users').del();
    await knex.destroy();
}
