import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import HandleError from '@/utils/handleError';

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new HandleError("Product not found", 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

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

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        const order = await Order.findById(orderId).populate('user', 'name email').populate('orderItems.product', 'name price image');

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
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


export async function PUT(req, { params }) {
    await connectMongoDatabase();
    const { orderId } = await params;

    try {
        const authResult = await verifyUserAuth(req);
        console.log("Auth Result:", authResult);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        console.log("Role Access Result:", roleAccessResult);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        if (order.orderStatus === "Delivered") {
            return NextResponse.json({ message: "You have already delivered this order" }, { status: 400 });
        }

        const { status } = await req.json();
        order.orderStatus = status;

        if (status === "Delivered") {
            order.deliveredAt = Date.now();
            for (const o of order.orderItems) {
                await updateStock(o.product, o.quantity);
            }
        }

        await order.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            order: JSON.parse(JSON.stringify(order)),
        }, { status: 200 });

    } catch (error) {
        console.error("Error in PUT /api/admin/order/[orderId]:", error);
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Order ID: ${orderId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectMongoDatabase();
    
    const url = new URL(req.url);
    const orderId = url.pathname.split('/').pop();

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
        console.log("Attempting to delete order with ID:", orderId);
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
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