'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { UserCircle, LogOut, LogIn } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession();
    
    // Fix: Ensure username is displayed properly
    const username = session?.user?.name || session?.user?.email?.split('@')[0] || "Guest";

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-white tracking-wide">
                    AnnoySend
                </Link>

                {/* User Section */}
                <div className="flex items-center gap-6 text-white mt-3 md:mt-0">
                    {session ? (
                        <>
                            <span className="flex items-center gap-2 text-lg font-semibold">
                                <UserCircle className="h-7 w-7 text-white" />
                                {username}
                            </span>
                            <button 
                                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                                onClick={() => signOut()}
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login">
                            <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200">
                                <LogIn className="h-5 w-5" />
                                SignUp
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
