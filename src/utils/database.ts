import { knex } from '../models/db';
import { seed } from '../../seeds/seed_users';

/**
 * Setup predictable test data:
 * - Clear the users table
 * - Insert one or more known user records
 */

const defaultUser = {
    country_code: '+49',
    phone_number: 123456789,
    email: 'integration-tests@test-precondition.se',
    reserved: false,
    registered: false
};

const reservedUser = {
    country_code: '+49',
    phone_number: 123456789,
    email: 'integration-tests@test-precondition.se',
    reserved: true,
    registered: false
}

export async function setupDatabase(): Promise<void> {
    await knex('users').del();
    await seed(knex);
}

export async function insertDefaultUser(): Promise<void> {
    await knex('users').insert(defaultUser);
}

export async function insertLockedUser(): Promise<void> {
    await knex('users').insert(reservedUser);
}

export async function teardownDatabase(): Promise<void> {
    await knex('users').del();
}
