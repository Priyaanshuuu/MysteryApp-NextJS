"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
        className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 text-center"
      >
        <h1 className="text-5xl font-bold text-gray-900">Welcome to AnonySend</h1>
        <p className="text-lg text-gray-700 mt-4">Send messages to whomever you want without revealing your identity.</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
          onClick={() => router.push("/signup")}
        >
          Get Started
        </motion.button>
        
        <p className="text-sm text-gray-600 mt-4">Already have an account? 
          <span 
            className="text-purple-500 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          > Log in</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
