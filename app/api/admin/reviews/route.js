import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import HandleError from '@/utils/handleError';

export async function GET(req) {
    await connectMongoDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

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

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            reviews: JSON.parse(JSON.stringify(product.reviews)),
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Product ID: ${productId}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectMongoDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const reviewId = searchParams.get('id');

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

        if (!productId || !reviewId) {
            return NextResponse.json({ message: "Product ID and Review ID are required" }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== reviewId.toString()
        );

        let avg = 0;
        if (reviews.length > 0) {
            reviews.forEach((rev) => {
                avg += rev.rating;
            });
            avg = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            productId,
            {
                reviews,
                ratings: avg,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        return NextResponse.json({
            success: true,
            message: "Review Deleted Successfully",
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid ID provided` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
