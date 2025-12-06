import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { sendToken } from '@/utils/jwtToken';
import HandleError from '@/utils/handleError';
import bcryptjs from 'bcryptjs';

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Please enter email and password" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordMatched = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatched) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        const { token, cookieOptions } = sendToken(user, 200);

        const response = NextResponse.json({
            success: true,
            user: JSON.parse(JSON.stringify(user)),
            token,
        }, { status: 200 });

        response.cookies.set('token', token, cookieOptions);

        return response;

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
