import { Router } from "express";
import {getUserHandler, registerUserHandler, removeUserHandler, unlockUserHandler} from "../controllers/userController";

const router = Router();

router.get("/user/data", getUserHandler);
router.patch("/user/unlock", unlockUserHandler);
router.get("/user/registered", registerUserHandler);
router.delete("/user", removeUserHandler); //change


export default router;
