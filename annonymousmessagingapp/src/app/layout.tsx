'use client';



import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
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
}>)
 {
  //const pathname = usePathname();
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
