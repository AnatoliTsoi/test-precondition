import { z } from 'zod';

export const registerUserBodySchema = z.object({
    redCarpetConsent: z.boolean()
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
