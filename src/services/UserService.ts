import { knex } from "../models/db";
import { User } from "../models/User";
import { Knex } from "knex";
import {createLoggerForService} from "../logging/logger";

const logger = createLoggerForService("UserService");

export class UserService {
    async getAvailableUser(trx?: Knex.Transaction): Promise<User | null> {
        logger.info(`Searching for available user...`);

        let query = knex("users")
            .where({ registered: false, reserved: false })
            .select();

        if (trx) {
            query = query.transacting(trx);
        }

        const users: User[] = await query;

        if (users.length === 0) {
            logger.warn(`No available users found`);
            return null;
        }

        const random = Math.floor(Math.random() * users.length);
        logger.info(`Found available user: ${users[random].id}`);
        return users[random];
    }

    async reserveUser(userId: number, trx?: Knex.Transaction): Promise<User> {
        logger.info(`Reserving user ${userId}...`);

        let query = knex("users")
            .where({ id: userId })
            .update({ reserved: true })
            .returning("*");

        if (trx) {
            query = query.transacting(trx);
        }

        const [user] = await query;

        if (!user) {
            logger.warn(`Failed to reserve user ${userId} (not found)`);
            throw new Error(`User ${userId} not found`);
        }

        logger.info(`User ${userId} successfully reserved`);
        return user;
    }

    async unlockUser(userId: number, trx?: Knex.Transaction): Promise<User> {
        logger.info(`Unlocking user ${userId}...`);

        let query = knex("users")
            .where({ id: userId })
            .update({ reserved: false })
            .returning("*");

        if (trx) {
            query = query.transacting(trx);
        }

        const [user] = await query;

        if (!user) {
            logger.warn(`Failed to unlock user ${userId} (not found)`);
            throw new Error(`User ${userId} not found`);
        }

        logger.info(`User ${userId} successfully unlocked`);
        return user;
    }

    async getUserByEmail(email: string, trx?: Knex.Transaction): Promise<User | null> {
        logger.info(`Fetching user by email: ${email}`);

        let query = knex("users").where({ email });

        if (trx) {
            query = query.transacting(trx);
        }

        const [user] = await query;

        if (!user) {
            logger.warn(`User not found by email: ${email}`);
        } else {
            logger.info(`Found user ${user.id} by email: ${email}`);
        }

        return user || null;
    }

    async updateUser(userId: number, updateData: Partial<User>, trx?: Knex.Transaction): Promise<User> {
        logger.info(`Updating user ${userId} with data: ${JSON.stringify(updateData)}`);

        let query = knex("users")
            .where({ id: userId })
            .update(updateData)
            .returning("*");

        if (trx) {
            query = query.transacting(trx);
        }

        const [user] = await query;

        if (!user) {
            logger.warn(`Failed to update user ${userId} (not found)`);
            throw new Error(`User ${userId} not found`);
        }

        logger.info(`Successfully updated user ${userId}`);
        return user;
    }
}
