import { Router } from "express";
import { getUserDataHandler, registerUserHandler, removeUserHandler, unlockUserHandler } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { registerUserBodySchema } from "../validators/userEndpoints/registerUser.schema";
import { unlockUserBodySchema } from "../validators/userEndpoints/unlockUser.schema";
import { deleteUserBodySchema } from "../validators/userEndpoints/deleteUser.schema";

const router = Router();

/**
 * @swagger
 * /user/data:
 *   patch:
 *     summary: Returns a user object that can be used for registration and marks it as reserved
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 birth_date:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 address:
 *                   type: string
 *                 zip_code:
 *                   type: string
 *                 city:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone_number:
 *                   type: integer
 *                 country_code:
 *                   type: string
 *                 country:
 *                   type: string
 *                 reserved:
 *                   type: boolean
 *                 registered:
 *                   type: boolean
 *       404:
 *         description: No available data sets
 */
router.patch("/user/data", getUserDataHandler);

/**
 * @swagger
 * /user/unlock:
 *   patch:
 *     summary: Unlock a user (set reserved=false) by email
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       204:
 *         description: User successfully unlocked
 *       400:
 *         description: Invalid request body or user is not reserved
 */
router.patch("/user/unlock", validate(unlockUserBodySchema, "body"), unlockUserHandler);

/**
 * @swagger
 * /user/registered:
 *   post:
 *     summary: Register a new user and return their data
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               redCarpetConsent:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully
 *       404:
 *         description: No available users
 *       400:
 *         description: Invalid request body
 */
router.post("/user/registered", validate(registerUserBodySchema, "body"), registerUserHandler);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete a user from Relation+ and Cognito by email
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid query parameter
 */
router.delete("/user", validate(deleteUserBodySchema, "query"), removeUserHandler);

export default router;