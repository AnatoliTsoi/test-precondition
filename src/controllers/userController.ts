import {Request, Response, NextFunction} from "express";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
import {generateFakeUserData} from "../utils/generateFakeUserData";
import {OmniService} from "../services/external/omni/OmniService";
import {NipClient} from "../services/external/nip/NipClient";
import baseLogger from '../logging/logger';
import {knex} from "../models/db";


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
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const redCarpetConsent: boolean = req.query.redCarpetConsent === 'true';

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
            user = await userService.updateUser(user.id, {registered: true}, trx);

            res.status(201).json(user);
            baseLogger.info(`User ${user.email} registered successfully`);
        });

    } catch (error) {
        next(error);
    }
}

export async function unlockUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const {email} = req.body;
        await knex.transaction(async (trx) => {
            if (!email || typeof email !== "string") {
                res.status(400).json({message: "Email query parameter of string is required"});
                return
            }

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
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const {email} = req.query;

        await knex.transaction(async (trx) => {
            if (!email || typeof email !== "string") {
                res.status(400).json({message: "Email query parameter of string is required"});
                return
            }

            let user: User | null = await userService.getUserByEmail(email);
            const {memberId} = await nipClient.getCustomer(email);

            await nipClient.deleteMember(memberId);

            try {
                await nipClient.deleteCicMember(memberId)
            } catch (error: any) {
                if (error.response.data === "User not found" && error.response.status === 404) {
                    /**
                     * User is registered in Cognito after first signing in, not signing up
                     * 404 is expected since deleteMember() will trigger a webhook for deleting it from cognito as well
                     * In some cases it doesn't happen though which is the reason of this call
                     */
                } else {
                    throw error;
                }
            }

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
