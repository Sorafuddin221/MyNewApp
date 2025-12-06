import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';

export async function GET(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        const users = await User.find();

        return NextResponse.json({
            success: true,
            users: JSON.parse(JSON.stringify(users)),
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
