'use-client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/router"
import { signInSchmea } from "../schemas/signInSchema"
import { signUpSchema } from "../schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

const  Page=()=>{
  const [username,setUsername] = useState('')
  const [usernameMessage, setUsernameMessage]= useState('')
  const [isCheckingUsername, setIsCheckingUsername]=useState(false)
  const [isSubmitting, setIsSubmitting]= useState(false)
  const debounceduserName = useDebounceValue(username,300)
  const{ toast} = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signInSchmea),
    defaultValues:{
      username: '',
      email:'',
      password: ''
    }
  })
   useEffect(()=>{
    const checkUsernameUnique = async()=>{
      if(debounceduserName){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          await axios.get(`/api/check-username-unique?username=${debounceduserName}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsername(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
   },[debounceduserName])

   const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in singup the user",error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false) 
    }
   }



  return (
    <div>page </div>   
  )
}

export default Page
