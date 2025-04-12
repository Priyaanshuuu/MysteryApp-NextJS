'use client';

import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ToastProvider } from "@/components/ui/toast"; // Ensure this is imported from the correct path
import { Toaster } from "@/components/ui/toaster"; // This is for displaying the toast notifications
//import Navbar from '../components/Navbar'
//import { usePathname } from "next/navigation";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ToastProvider> {/* Wrap everything in ToastProvider */}
        <AuthProvider>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
            <Toaster /> {/* This will show your toast notifications */}
          </body>
        </AuthProvider>
      </ToastProvider>
    </html>
  );
}
