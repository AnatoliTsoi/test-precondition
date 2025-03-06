import { Router } from "express";
import {getUserHandler, registerUserHandler, unlockUserHandler} from "../controllers/userController";

const router = Router();

router.get("/user/data", getUserHandler);
router.patch("/user/unlock", unlockUserHandler);
router.get("/user/registered", registerUserHandler);


export default router;
