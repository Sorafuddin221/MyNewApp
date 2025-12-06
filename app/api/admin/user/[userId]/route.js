import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import User from '@/models/userModels';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import HandleError from '@/utils/handleError';

export async function GET(req, { params }) {
    await connectMongoDatabase();
    const { userId } = params;

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

        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: JSON.parse(JSON.stringify(targetUser)),
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid User ID: ${userId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    await connectMongoDatabase();
    const { userId } = params;

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

        const { role } = await req.json();

        const targetUser = await User.findByIdAndUpdate(userId, { role }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        if (!targetUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User Role Updated Successfully",
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid User ID: ${userId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await connectMongoDatabase();
    const { userId } = params;

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

        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Remove avatar from cloudinary
        if (targetUser.avatar && targetUser.avatar.public_id) {
            await cloudinary.uploader.destroy(targetUser.avatar.public_id);
        }
        
        await targetUser.deleteOne();

        return NextResponse.json({
            success: true,
            message: "User Deleted Successfully",
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid User ID: ${userId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
