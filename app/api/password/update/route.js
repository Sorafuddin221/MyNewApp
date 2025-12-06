import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { verifyUserAuth } from '@/middleware/auth';
import HandleError from '@/utils/handleError';
import bcryptjs from 'bcryptjs';

export async function PUT(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const { oldPassword, newPassword, confirmPassword } = await req.json();

        if (!oldPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ message: "Please enter all fields" }, { status: 400 });
        }

        const isPasswordMatched = await user.VerifyPassword(oldPassword);

        if (!isPasswordMatched) {
            return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ message: "New password and confirm password do not match" }, { status: 400 });
        }
        
        user.password = newPassword; // Mongoose pre-save hook will hash it
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password Updated Successfully",
        }, { status: 200 });

    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
