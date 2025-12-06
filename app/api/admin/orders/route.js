import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';

export async function GET(req) {
    await connectMongoDatabase();

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

        const orders = await Order.find().populate('user', 'name email').populate('orderItems.product', 'name price image');

        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        return NextResponse.json({
            success: true,
            totalAmount,
            orders: JSON.parse(JSON.stringify(orders)),
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
