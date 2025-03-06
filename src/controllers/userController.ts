import {Request, Response, NextFunction} from "express";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
import {generateFakeUserData} from "../utils/generateFakeUserData";
import {OmniService} from "../services/external/omni/OmniService";
import {NipClient} from "../services/external/nip/NipClient";


const userService = new UserService();

export async function getUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        let user: User | null = await userService.getAvailableUser();
        if (!user) {
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
            res.status(404).json({message: "No users available"});
            return;
        }

        user = await userService.reserveUser(user.id)
        const fakeData: object = generateFakeUserData();
        user = await userService.updateUser(user.id, fakeData);

        const omniResponse = await OmniService.signUp(user, redCarpetConsent);
        user = await userService.updateUser(user.id, {registered: true});

        res.status(200).json(user);

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

        //let user: User | null = await userService.getUserByEmail(email);

        let nipClient: NipClient = new NipClient();

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


        //DON't FORGET ABOUT CHANGING STATE IN DB

        res.status(204).send({
            message: "User removed"
        });
    } catch (error) {
        next(error);
    }
}
