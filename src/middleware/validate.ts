import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware for validating request data using a Zod schema.
 *
 * Supports validating data from `req.body`, `req.query`, or `req.params`.
 * If validation fails, responds with a 400 status and a detailed error message.
 * If validation succeeds, it replaces the original request data with the parsed and typed result.
 *
 * @param schema - A Zod schema used for validation.
 * @param source - The source of the data to validate: "body", "query", or "params". Defaults to "body".
 * @returns Express middleware function.
 *
 * @example
 * router.post(
 *   "/user/registered",
 *   validate(registerUserSchema, "body"),
 *   registerUserHandler
 * );
 */

export const requestValidationErrorText = "Request parameters validation failed";

export function validate(
    schema: ZodSchema,
    source: "body" | "query" | "params" = "body"
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            res.status(400).json({
                error: requestValidationErrorText,
                issues: result.error.format()
            });
            return;
        }

        req[source] = result.data;
        next();
    };
}
