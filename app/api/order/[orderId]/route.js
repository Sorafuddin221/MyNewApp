import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import { verifyUserAuth } from '@/middleware/auth';
import HandleError from '@/utils/handleError';

export async function GET(req, { params }) {
    let orderId;
    try {
        await connectMongoDatabase();
        orderId = req.nextUrl.pathname.split('/').pop();
        
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const order = await Order.findById(orderId).populate('user', 'name email').populate('orderItems.product', 'name price image');

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

       

        // Only allow access if the order belongs to the authenticated user
        if (String(order.user._id) !== String(user._id)) {
            return NextResponse.json({ message: "You are not authorized to view this order" }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            order: JSON.parse(JSON.stringify(order)),
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Order ID: ${orderId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    let orderId;
    try {
        await connectMongoDatabase();
        orderId = req.nextUrl.pathname.split('/').pop();
        
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Only allow deletion if the order belongs to the authenticated user
        if (order.user.toString() !== user._id.toString()) {
            return NextResponse.json({ message: "You are not authorized to delete this order" }, { status: 403 });
        }

        await order.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Order Deleted Successfully",
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Order ID: ${orderId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
