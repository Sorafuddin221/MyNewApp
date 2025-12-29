import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import PaymentSettings from '@/models/paymentSettingsModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError'; // Correct import

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
        // Use custom error handler if available, or just throw
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

export const POST = handleAsyncError(async (request) => {
    await db(); // Connect to DB

    const authResult = await verifyUserAuth(request);
    if (!authResult.isAuthenticated) {
        return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
    }
    const user = authResult.user;

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
    } = await request.json(); // Use request.json()

    // Fetch payment settings for calculations
    const paymentSettings = await PaymentSettings.findOne();
    const taxPercentage = paymentSettings?.taxPercentage || 0;
    const insideDhakaShippingCost = paymentSettings?.insideDhakaShippingCost || 0;
    const outsideDhakaShippingCost = paymentSettings?.outsideDhakaShippingCost || 0;

    let itemPrice = 0;
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            const error = new Error(`Product with ID ${item.product} not found`);
            error.statusCode = 404;
            throw error;
        }
        itemPrice += product.price * item.quantity; // Use actual product price from DB
    }

    const taxPrice = itemPrice * (taxPercentage / 100);

    let shippingPrice = 0;
    // Assuming 'city' is available in shippingInfo and check for 'Dhaka' for inside Dhaka shipping
    if (shippingInfo.city && shippingInfo.city.toLowerCase().includes('dhaka')) {
        shippingPrice = insideDhakaShippingCost;
    } else {
        shippingPrice = outsideDhakaShippingCost;
    }

    const totalPrice = itemPrice + taxPrice + shippingPrice;

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

    // Update product stock
    for (const o of order.orderItems) {
        await updateStock(o.product, o.quantity);
    }

    return NextResponse.json({
        success: true,
        order: JSON.parse(JSON.stringify(order)),
    }, { status: 201 });
});