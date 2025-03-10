import {Request, Response, NextFunction} from "express";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
import {generateFakeUserData} from "../utils/generateFakeUserData";
import {OmniService} from "../services/external/omni/OmniService";
import {NipClient} from "../services/external/nip/NipClient";
import baseLogger from '../logging/logger';
import {knex} from "../models/db";
import {RegisterUserBody} from "../validators/userEndpoints/registerUser.schema";
import {UnlockUserBody} from "../validators/userEndpoints/unlockUser.schema";
import {DeleteUserBody} from "../validators/userEndpoints/deleteUser.schema";


const userService = new UserService();
const nipClient: NipClient = new NipClient();

export async function getUserDataHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await knex.transaction(async (trx) => {
            let user: User | null = await userService.getAvailableUser();

            if (!user) {
                res.status(404).json({message: "No users available"});
                return;
            }

            user = await userService.reserveUser(user.id)
            const fakeData: object = generateFakeUserData();
            user = await userService.updateUser(user.id, fakeData);
            res.status(200).json(user);
        });
    } catch (error) {
        next(error);
    }
}

export async function registerUserHandler(
    req: Request<any, any, RegisterUserBody>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const {redCarpetConsent} = req.body;

        await knex.transaction(async (trx) => {
            let user: User | null = await userService.getAvailableUser(trx);

            if (!user) {
                res.status(404).json({message: "No users available"});
                return;
            }

            user = await userService.reserveUser(user.id, trx);
            const fakeData: object = generateFakeUserData();
            user = await userService.updateUser(user.id, fakeData, trx);

            await OmniService.signUp(user, redCarpetConsent);
            const {memberId} = await nipClient.getCustomer(user.email);
            user = await userService.updateUser(user.id, {registered: true, member_id: memberId}, trx);

            res.status(201).json(user);
            baseLogger.info(`User ${user.email} registered successfully`);
        });

    } catch (error) {
        next(error);
    }
}

export async function unlockUserHandler(
    req: Request<any, any, UnlockUserBody>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const {email} = req.body;
        await knex.transaction(async (trx) => {
            let user: User | null = await userService.getUserByEmail(email);
            if (!user?.reserved) {
                res.status(400).json({message: "User is not reserved"});
                return
            }

            await userService.unlockUser(user.id);
            res.status(204).send();
            baseLogger.info(`Successfully unlocked user with email ${email}`);
        });
    } catch (error) {
        next(error);
    }
}

export async function removeUserHandler(
    req: Request<any, any, any, DeleteUserBody>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const {email} = req.query;

        await knex.transaction(async (trx) => {

            let user: User | null = await userService.getUserByEmail(email);
            const {memberId} = await nipClient.getCustomer(email);

            if (user?.member_id === null) {
                user = await userService.updateUser(user.id, {member_id: memberId});
            }

            await nipClient.deleteMember(memberId);

            await nipClient.deleteCicMember(memberId)

            if (user?.id) {
                await userService.updateUser(user.id, {reserved: false, registered: false});
            }

            res.status(204).send({message: `User with memberId - ${memberId} removed`});
            baseLogger.info(`Successfully removed user with email ${email}`);
        });
    } catch (error) {
        next(error);
    }
}

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    baseLogger.error("Unhandled error", {
        method: req.method,
        url: req.originalUrl,
        status: statusCode,
        message,
        stack: err.stack || "No stack trace",
    });

    res.status(statusCode).json({
        error: message,
        statusCode,
    });
}
