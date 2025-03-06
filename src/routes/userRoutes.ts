import { Router } from "express";
import {getUserHandler, registerUserHandler, removeUserHandler, unlockUserHandler} from "../controllers/userController";

const router = Router();

router.patch("/user/data", getUserHandler);
router.patch("/user/unlock", unlockUserHandler);
router.post("/user/registered", registerUserHandler);
router.delete("/user", removeUserHandler); //change


export default router;
