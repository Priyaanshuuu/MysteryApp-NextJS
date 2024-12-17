import {z} from 'zod'

export const messageSchema = z.object({
    content: z
    .string()
    .min(10,"The message is not long enough")
    .max(300,"The message is too long")
})