import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import Notification from '@/models/notificationModel'; // Import Notification model
import { verifyUserAuth } from '@/middleware/auth';
import HandleError from '@/utils/handleError'; // Assuming you have this utility

export async function POST(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const { question, productId } = await req.json();

        if (!productId || !question) {
            return NextResponse.json({ message: "Product ID and question are required." }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const customerQuery = {
            user: user._id,
            name: user.name,
            question: question,
        };

        product.customerQueries.push(customerQuery);

        await product.save({ validateBeforeSave: false });

        // Create a notification for the admin
        const notification = new Notification({
            user: user._id, // The user who asked the question
            message: `New query on "${product.name}" by ${user.name}`,
            link: `/product/${product._id}?tab=queries` // Link to the product page queries tab
        });
        await notification.save();


        return NextResponse.json({
            success: true,
            message: "Question submitted successfully.",
        }, { status: 201 });

    } catch (error) {
        console.error("Question submission error:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
