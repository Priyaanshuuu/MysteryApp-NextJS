import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (!token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') || 
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.next();
    }

    if (token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up')
    )) {
        if (request.cookies.get("first_visit")) {
            return NextResponse.redirect(new URL('/home', request.url));
        } else {
            const response = NextResponse.next();
            response.cookies.set("first_visit", "true", { maxAge: 10, path: "/" });
            return response;
        }
    }

    if (!token && (
        url.pathname.startsWith('/dashboard') || 
        url.pathname.startsWith('/home')
    )) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
