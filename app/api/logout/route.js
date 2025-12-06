import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Logged Out",
    }, { status: 200 });

    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiry to past to delete cookie
    });

    return response;
}
