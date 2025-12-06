import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import { verifyUserAuth } from '@/middleware/auth';
import HandleError from '@/utils/handleError'; // Assuming you have this utility

export async function PUT(req) {
    await connectMongoDatabase();

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const { rating, comment, productId } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json({ message: "Product ID and rating are required." }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const review = {
            user: user._id,
            name: user.name,
            rating: Number(rating),
            comment,
        };

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === user._id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully.",
        }, { status: 200 });

    } catch (error) {
        console.error("Review submission error:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
