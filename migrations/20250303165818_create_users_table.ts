import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("first_name");
        table.string("last_name");
        table.date("birth_date");
        table.string("gender");
        table.string("address");
        table.string("zip_code");
        table.string("city");
        table.string("password");
        table.string("email").notNullable();
        table.string("phone_number").notNullable();
        table.string("country_code");
        table.string("country");
        table.string("member_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
}
