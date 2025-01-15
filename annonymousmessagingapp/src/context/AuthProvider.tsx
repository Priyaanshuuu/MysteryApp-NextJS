'use client'
//By default bhot saare components server side pe run krte prr we need this file to run into the client side
// so thats why yeh "use client use kia gaya hai"

import { SessionProvider } from "next-auth/react"

// SessionProvider is a nextjs component that manages the authentication state throghout the app

export default function AuthProvider({
  children,

}: {children: React.ReactNode}) {
  //React.ReactNode kaa mtlb hai ki children can be any react content like HTMl yaa koi aur component
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}