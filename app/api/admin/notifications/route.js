import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Notification from '@/models/notificationModel';
import { verifyUserAuth, checkAdmin } from '@/middleware/auth';

// GET unread notifications
export async function GET(req) {
    await connectMongoDatabase();
    
    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated || authResult.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const notifications = await Notification.find({ read: false }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            notifications
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

// PUT (mark a notification as read)
export async function PUT(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated || authResult.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { notificationId } = await req.json();

        if (!notificationId) {
            return NextResponse.json({ message: "Notification ID is required." }, { status: 400 });
        }

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return NextResponse.json({ message: "Notification not found." }, { status: 404 });
        }

        notification.read = true;
        await notification.save();

        return NextResponse.json({
            success: true,
            message: "Notification marked as read."
        });

    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
