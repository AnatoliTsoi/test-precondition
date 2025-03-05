import { Router } from "express";
import {getUserHandler, unlockUserHandler} from "../controllers/userController";

const router = Router();

router.get("/user", getUserHandler);
router.put("/user/unlock", unlockUserHandler);

export default router;
