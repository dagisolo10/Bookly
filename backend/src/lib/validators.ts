import { z } from "zod";

/**
 * User Schema
 */

export const createUserSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters."),
    })
    .strict();

export const updateUserSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters."),
    })
    .strict();
