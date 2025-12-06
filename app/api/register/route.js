import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { sendToken } from '@/utils/jwtToken';
import { v2 as cloudinary } from 'cloudinary';
import HandleError from '@/utils/handleError';

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const formData = await req.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const avatarFile = formData.get('avatar');

        if (!name || !email || !password || !avatarFile) {
            return NextResponse.json({ message: "Please enter all fields and provide an avatar" }, { status: 400 });
        }

        let avatar = {};

        // Upload avatar to Cloudinary
        if (avatarFile) {
            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload the buffer to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: 'avatars',
                    crop: 'scale'
                }, (error, uploadResult) => {
                    if (error) {
                        return reject(new HandleError("Cloudinary upload failed", 500));
                    }
                    resolve(uploadResult);
                }).end(buffer);
            });

            avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } else {
            return NextResponse.json({ message: "Avatar is required" }, { status: 400 });
        }
        
        const user = await User.create({
            name,
            email,
            password,
            avatar,
        });

        const { token, cookieOptions } = sendToken(user, 201);

        const response = NextResponse.json({
            success: true,
            user: JSON.parse(JSON.stringify(user)),
            token,
        }, { status: 201 });

        response.cookies.set('token', token, cookieOptions);

        return response;

    } catch (error) {
        // Handle specific Mongoose errors, e.g., duplicate email
        if (error.code === 11000) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
