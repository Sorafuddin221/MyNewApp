import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import { verifyUserAuth } from '@/middleware/auth';

export async function GET(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);

        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }

        const user = authResult.user;

        return NextResponse.json({
            success: true,
            user,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
