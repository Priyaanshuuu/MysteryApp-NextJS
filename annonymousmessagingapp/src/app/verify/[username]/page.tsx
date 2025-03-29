'use client';

import { verifySchema } from '@/app/schemas/verifySchema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {  useSession } from 'next-auth/react';

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const { update } = useSession(); // session update karne ke liye

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      // 🔹 Session ko update karo verification ke baad
      await update();

      // ✅ Directly Dashboard pe redirect karo
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error in verifying user', error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Verification failed',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-600">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" {...field} className="w-full px-4 py-2 border rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
              Submit
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default VerifyAccount;
