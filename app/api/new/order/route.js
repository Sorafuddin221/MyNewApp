import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import { verifyUserAuth } from '@/middleware/auth';
import HandleError from '@/utils/handleError';

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new HandleError("Product not found", 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = await req.json();

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: user._id,
        });

        for (const o of order.orderItems) {
            await updateStock(o.product, o.quantity);
        }

        return NextResponse.json({
            success: true,
            order: JSON.parse(JSON.stringify(order)),
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
