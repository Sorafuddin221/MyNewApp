import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { sendEmail } from '@/utils/sendEmail';
import HandleError from '@/utils/handleError';

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset/${resetToken}`;
        const message = `Your password reset token is: 

 ${resetPasswordUrl} 

 If you have not requested this email then, please ignore it.`;

        await sendEmail({
            email: user.email,
            subject: `ShopEasy Password Recovery`,
            message,
        });

        return NextResponse.json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        }, { status: 200 });

    } catch (error) {
        // If there's an error sending email, reset the tokens in the user
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
