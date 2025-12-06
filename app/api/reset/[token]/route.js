import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import crypto from 'crypto';
import HandleError from '@/utils/handleError';

export async function POST(req, { params }) {
    await connectMongoDatabase();
    const resolvedParams = await Promise.resolve(params); // Ensure params is resolved
    const { token } = resolvedParams;

    try {
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "Reset password token is invalid or has expired" }, { status: 400 });
        }

        const { password, confirmPassword } = await req.json();

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Password and confirm password do not match" }, { status: 400 });
        }

        user.password = password; // Mongoose pre-save hook will hash it
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password Updated Successfully",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
