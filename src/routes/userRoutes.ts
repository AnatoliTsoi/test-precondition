import { Router } from "express";
import {getUserDataHandler, registerUserHandler, removeUserHandler, unlockUserHandler} from "../controllers/userController";
import {validate} from "../middleware/validate";
import {registerUserBodySchema} from "../validators/userEndpoints/registerUser.schema";
import {unlockUserBodySchema} from "../validators/userEndpoints/unlockUser.schema";
import {deleteUserBodySchema} from "../validators/userEndpoints/deleteUser.schema";

const router = Router();

router.patch("/user/data", getUserDataHandler);
router.patch("/user/unlock", validate(unlockUserBodySchema, "body"), unlockUserHandler);
router.post("/user/registered", validate(registerUserBodySchema, "body"), registerUserHandler);
router.delete("/user", validate(deleteUserBodySchema, "query"), removeUserHandler);


export default router;
