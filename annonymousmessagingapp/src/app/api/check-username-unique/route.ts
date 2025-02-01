import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod"
import { usernameValidation } from "@/app/schemas/signUpSchema";


const UsernameQuerySchmena = z.object({
    username: usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
    //localhost:3000/api/cuu?username=hitesh?phone=android

    try {
        const {searchParams} = new URL(request.url)
        const queryParam  = {
            username: searchParams.get('username')
        }
        const result =UsernameQuerySchmena.safeParse(queryParam)
        console.log(result);
        if(!result.success){
            const usernameErrors= result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0?usernameErrors.join(',')
                :'Invalid query parameters',
            },{status:400})
        }

        const {username} = result.data

        const existingverifiedUser = await UserModel.findOne({username,isVerified:true})

        if(existingverifiedUser){
            return Response.json({
                success:false,
                message:'Username is already taken',
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:'Username is unique',
            },{status:400})
        }
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json(
            {
                success:false,
                message: "Error checking username"
            },
            {
                status:500
            }
        )
        
    }
}