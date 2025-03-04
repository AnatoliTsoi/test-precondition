import {knex} from "../models/db";
import {User} from "../models/User";

export class UserService {

    async getAvailableUser(): Promise<User | null> {
        const users: User[] = await knex("users")
            .where({ registered: false, reserved: false })
            .select();

        if (users.length === 0) {
            return null;
        }

        const random = Math.floor(Math.random() * users.length);
        return users[random];
    }

    async reserveUser(userId: number): Promise<User> {
        const [user] = await knex("users")
            .where({ id: userId })
            .update({ reserved: true })
            .returning("*");

        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const [user] = await knex("users").where({ email });
        return user || null;
    }


    async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
        const [user] = await knex("users")
            .where({ id: userId })
            .update(updateData)
            .returning("*");
        return user;
    }
}
