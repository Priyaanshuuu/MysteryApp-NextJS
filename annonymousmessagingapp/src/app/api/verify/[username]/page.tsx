'use client';

import { verifySchema } from '@/app/schemas/verifySchema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button'; // 🔥 Fix: Correct Button import
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'; // 🔥 Fix: Correct Input import
import { Form } from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form'; // 🔥 Fix: Import useForm

function VerifyAccount() { // 🔥 Fix: Correct Component Name
  const router = useRouter();
  const params = useParams<{ username: string }>(); // 🔥 Fix: Correct params usage
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username, // 🔥 Fix: params.username used correctly
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace('/sign-in'); // 🔥 Fix: Correct redirect path
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Signup failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code" // 🔥 Fix: Correct field name
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount; // 🔥 Fix: Correct Export Name
