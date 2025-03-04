import { Router } from "express";
import { getUserHandler } from "../controllers/userController";

const router = Router();

router.get("/user", getUserHandler);

export default router;
