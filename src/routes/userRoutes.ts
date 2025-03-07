import { Router } from "express";
import {getUserDataHandler, registerUserHandler, removeUserHandler, unlockUserHandler} from "../controllers/userController";

const router = Router();

router.patch("/user/data", getUserDataHandler);
router.patch("/user/unlock", unlockUserHandler);
router.post("/user/registered", registerUserHandler);
router.delete("/user", removeUserHandler); //change


export default router;
