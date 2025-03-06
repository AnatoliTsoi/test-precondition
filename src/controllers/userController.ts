import {Request, Response, NextFunction} from "express";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
import {generateFakeUserData} from "../utils/generateFakeUserData";
import {OmniService} from "../services/external/omni/OmniService";
import {NipClient} from "../services/external/nip/NipClient";
import logger from '../utils/logger';


const userService = new UserService();
const nipClient: NipClient = new NipClient();

export async function getUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        let user: User | null = await userService.getAvailableUser();
        if (!user) {
            logger.warn('No available user found');
            res.status(404).json({message: "No users available"});
            return;
        }

        user = await userService.reserveUser(user.id)
        const fakeData: object = generateFakeUserData();
        user = await userService.updateUser(user.id, fakeData);
        res.status(200).json(user);
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
        let user: User | null = await userService.getAvailableUser();

        if (!user) {
            logger.warn("No users available");
            res.status(404).json({message: "No users available"});
            return;
        }

        user = await userService.reserveUser(user.id)
        const fakeData: object = generateFakeUserData();
        user = await userService.updateUser(user.id, fakeData);

        const omniResponse = await OmniService.signUp(user, redCarpetConsent);
        user = await userService.updateUser(user.id, {registered: true});

        res.status(201).json(user);

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

        if (!email || typeof email !== "string") {
            logger.warn(`Couldn't find a user with the email ${email}`);
            res.status(400).json({message: "Email query parameter of string is required"});
            return
        }

        let user: User | null = await userService.getUserByEmail(email);
        if (!user?.reserved) {
            logger.warn(`User with the email ${email} is not reserved`);
            res.status(400).json({message: "User is not reserved"});
            return
        }

        await userService.unlockUser(user.id);
        logger.info(`Successfully unlocked user with email ${email}`);
        res.status(204).send();
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

        if (!email || typeof email !== "string") {
            res.status(400).json({message: "Email query parameter of string is required"});
            return
        }

        let user: User | null = await userService.getUserByEmail(email);
        if (!user?.reserved) {
            logger.warn(`User with email ${email} is not reserved`);
            res.status(400).json({ message: "User is not reserved" });
            return;
        }

        const {memberId} = await nipClient.getCustomer(email);

        const deleteMemberResponse = await nipClient.deleteMember(memberId);

        try {
            const cicResponse =  await nipClient.deleteCicMember(memberId)
        } catch (error: any) {
            if (error.response.data === "User not found" && error.response.status === 404) {
                //Do nothing
            } else {
                throw error;
            }
        }

        if (user?.id) {
            user = await userService.updateUser(user.id, {reserved: false, registered: false});
        } else {
            //logg
        }

        res.status(204).send({
            message: `User with memberId - ${memberId} removed`
        });
    } catch (error) {
        next(error);
    }
}
