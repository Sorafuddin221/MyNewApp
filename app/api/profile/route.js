import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import { verifyUserAuth } from '@/middleware/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);

        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;
        const token=cookies(req).get('token')?.value || null;


        return NextResponse.json({
            success: true,
            user,
            token
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
