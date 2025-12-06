import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import { verifyUserAuth } from '@/middleware/auth';

export async function GET(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const orders = await Order.find({ user: user._id }).populate('orderItems.product', 'name price image');

        return NextResponse.json({
            success: true,
            orders: JSON.parse(JSON.stringify(orders)),
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
