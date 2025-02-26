'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-0" href="#">Mystery Message</a>
                {
                    session ? (
                        <div className="flex items-center gap-4">
                            <span className="mr-4">
                                Welcome, {session.user?.name || session.user?.email}
                            </span>
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                onClick={() => signOut()}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Login
                            </button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
