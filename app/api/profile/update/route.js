import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { verifyUserAuth } from '@/middleware/auth';
import cloudinary from '@/lib/cloudinary';
import HandleError from '@/utils/handleError';

export async function PUT(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const formData = await req.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const avatarFile = formData.get('avatar');

        const newData = {
            name,
            email,
        };

        // Update avatar to Cloudinary
        if (avatarFile && typeof avatarFile !== 'string') { // Check if a new file is provided
            // Destroy old avatar only if it exists
            if (user.avatar && user.avatar.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

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

            newData.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        return NextResponse.json({
            success: true,
            user: JSON.parse(JSON.stringify(updatedUser)),
            message: "Profile Updated Successfully",
        }, { status: 200 });

    } catch (error) {
        // Handle specific Mongoose errors, e.g., duplicate email
        if (error.code === 11000) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
