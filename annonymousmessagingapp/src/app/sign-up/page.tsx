"use client";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/app/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";

const Page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback((value) => setUsername(value), 300);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${window.location.origin}/api/sign-up`, data);
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace(`/verify/${data.username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in signing up the user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup Failed",
                description: errorMessage,
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-8"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Join Mystery Message</h1>
                    <p className="text-gray-700">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field} 
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            className="border-gray-300 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} className="border-gray-300 focus:ring-indigo-500" />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} className="border-gray-300 focus:ring-indigo-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition py-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </motion.button>
                    </form>
                </Form>
            </motion.div>
        </motion.div>
    );
};

export default Page;
