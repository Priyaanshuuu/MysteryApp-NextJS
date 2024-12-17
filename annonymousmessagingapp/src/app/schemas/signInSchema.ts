
import {z} from 'zod'

 export const signInSchmea = z.object({
    identifier: z.string(),
    password: z.string()

 })