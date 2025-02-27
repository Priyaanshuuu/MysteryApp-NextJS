"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
//import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Fixed import
//import { signUpSchema } from "@/app/schemas/signUpSchema";
import { signInSchmea } from "@/app/schemas/signInSchema";
//import axios, { AxiosError } from "axios";
//import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
//import { Toast } from "@/components/ui/toast";
//import { useDebounceCallback } from "usehooks-ts";

const Page = () => {
   

    //const debounced = useDebounceCallback((value) => setUsername(value), 300);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchmea>>({
        resolver: zodResolver(signInSchmea), // Fixed typo
        defaultValues: {
           // username: "",
            identifier: "",
            password: "",
        },
    });


    const onSubmit = async (data: z.infer<typeof signInSchmea>) => {
      const result = await signIn('credentials',{
        identifier: data.identifier,
        password: data.password
            })
            if(result?.error){
             toast({
              title: "Login failed",
              description: "Incorrect username or password",
              variant:"destructive"
             })
            }
         if(result?.url){
          router.replace('/dashboard')
         }
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                       
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel> {}
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel> {/* Fixed label */}
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                             (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : (
                                Sign Up
                            )
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Page;
