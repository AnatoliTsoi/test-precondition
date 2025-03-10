import { z } from 'zod';

export const unlockUserBodySchema = z.object({
    email: z.string()
});

export type UnlockUserBody = z.infer<typeof unlockUserBodySchema>;
