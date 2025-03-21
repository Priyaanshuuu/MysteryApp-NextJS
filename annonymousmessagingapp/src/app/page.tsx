"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gray-100 flex flex-col gap-12 p-8"
    >
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-white shadow-md rounded-xl p-8 text-center max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800">Public Profile Link</h1>
        <h2 className="text-lg font-semibold text-gray-700 mt-2">
          Send anonymous messages to whomever you want
        </h2>

        
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          className="w-full mt-4 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your anonymous message here..."
          rows={5}
        ></motion.textarea>

        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 w-40 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mx-auto block"
        >
          Send
        </motion.button>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="w-full bg-white shadow-md rounded-xl p-8 text-center max-w-5xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-800">The AI Suggestion Section</h1>
        <motion.h2
          whileHover={{ scale: 1.1 }}
          className="text-lg font-semibold text-blue-600 mt-3 cursor-pointer hover:underline"
        >
          Click for AI suggestions
        </motion.h2>

        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="mt-4 p-6 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto text-left"
        >
          {[
            "Hey, just wanted to say you are awesome!",
            "Life is tough, but so are you.",
            "Your kindness never goes unnoticed.",
            "Believe in yourself, you've got this!",
            "A small act of kindness can change someone's day!",
          ].map((msg, index) => (
            <motion.p
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-gray-700 mb-2"
            >
              {msg}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
