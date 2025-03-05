import { Request, Response, NextFunction } from "express";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
import {generateFakeUserData} from "../utils/generateFakeUserData";
import {OmniService} from "../services/external/OmniService";


const userService = new UserService();

export async function getUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { registered } = req.query;
        let user : User | null = await userService.getAvailableUser();

        if (!user) {
            res.status(404).json({ message: "No available user" });
            return;
        }

        user = await userService.reserveUser(user.id)

        const fakeData = generateFakeUserData();
        user = await userService.updateUser(user.id, fakeData);

        if (registered ==="true") {
            const omniResponse = await OmniService.signUp(user);
            user = await userService.updateUser(user.id, { registered: true, member_id: omniResponse.memberId });
        }

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
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: "Email query parameter of string is required" });
            return
        }
        let user: User | null = await userService.getUserByEmail(email);

        if (!user?.reserved) {
            res.status(400).json({ message: "User is not reserved" });
            return
        }

        await userService.unlockUser(user.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}