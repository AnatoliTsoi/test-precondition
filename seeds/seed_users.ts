import * as Knex from "knex";

export async function seed(knex: Knex.Knex): Promise<void> {
    await knex("users").del();

    const users = [];
    for (let i = 0; i < 100; i++) {
        const phoneNumber = 890110000 + i;
        users.push({
            password: "Sample1231!",
            email: `test-precondition${phoneNumber}@mailslurp.biz`,
            phone_number: phoneNumber,
            country_code: "+353",
            reserved: false,
            registered: false,
        });
    }

    await knex("users").insert(users);
}
