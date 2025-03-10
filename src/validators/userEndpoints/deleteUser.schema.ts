import { z } from 'zod';

export const deleteUserBodySchema = z.object({
    email: z.string()
});

export type DeleteUserBody = z.infer<typeof deleteUserBodySchema>;
