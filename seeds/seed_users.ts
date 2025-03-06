import * as Knex from "knex";

export async function seed(knex: Knex.Knex): Promise<void> {
    await knex("users").del();

    const users = [];

    for (let i = 0; i < 100; i++) {
        const phoneNumber = 639980001 + i;
        users.push({
            password: "Sample123!",
            email: `test-precondition${phoneNumber}@mailslurp.biz`,
            phone_number: phoneNumber.toString(),
            country_code: "+33", //France
            reserved: false,
            registered: false,
        });
    }

    await knex("users").insert(users);
}
