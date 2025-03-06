import {knex} from "../../src/models/db";

export async function teardownDatabase(): Promise<void> {
    await knex('users').del();
}
