import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Allow NextAuth to handle auth routes by default
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request }) // user will get the token only when the user is logged in
    const url = request.nextUrl

    // 1. Allow access to auth pages if user is NOT authenticated
    // !token means the user is logged out
    if (!token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') || 
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.next()  // Allow unauthenticated users to access these pages
    }

    // 2. Redirect authenticated users AWAY from sign-in/up/verify to /home
    // Redirect to home page if the user is logged in
    if (token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') || 
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // 3. Redirect unauthenticated users from protected pages (like dashboard/home) to /sign-in
    // if the user ain't logged in then redirect the user to signin page
    if (!token && (
        url.pathname.startsWith('/dashboard') || 
        url.pathname.startsWith('/home')
    )) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()  // Allow all other requests
}

// Apply middleware to the following routes
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
