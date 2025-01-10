import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2, "Username must be atleast 2 characters")
.max(20,"USername must not be more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6,"password") 
})
// zod is nothing but a validation library. It is used to check whether the data coming meets our requirements or not
// Mongoose can also be used for the schema validations but here zod is used because it doesn;t require database
// zod is an application level based validation feature i.e it validates from the frontend and the backend
// In this project the data will come through API so zod is prefered over mongoose
// use mongoose whenever database validation is required