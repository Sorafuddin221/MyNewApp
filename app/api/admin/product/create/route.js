// app/api/admin/product/create/route.js
import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import connectDB from '@/lib/db'; // Assuming you have a db connection utility
import handleAsyncError from '@/middleware/handleAsyncError';
import { verifyUserAuth } from '@/middleware/auth'; // Import verifyUserAuth

export const POST = handleAsyncError(async (request) => {
    await connectDB();

    // Authenticate user
    const authResult = await verifyUserAuth(request);

    if (!authResult.isAuthenticated) {
        return NextResponse.json({
            success: false,
            message: authResult.error.message
        }, { status: authResult.statusCode });
    }

    const userId = authResult.user._id; // Get user ID from authenticated result

    const formData = await request.formData();

    const name = formData.get('name');
    const price = formData.get('price');
    const offeredPrice = formData.get('offeredPrice');
    const description = formData.get('description');
    const category = formData.get('category');
    const subCategory = formData.get('subCategory');
    const stock = formData.get('stock');
    const imagesString = formData.get('images');
    const colorsString = formData.get('colors'); // Get colors string

    // Parse the images JSON string back into an array of objects
    let images = [];
    if (imagesString) {
        images = JSON.parse(imagesString);
    }

    // Parse the colors JSON string back into an array of objects
    let colors = [];
    if (colorsString) {
        colors = JSON.parse(colorsString);
    }

    const product = await Product.create({
        name,
        price,
        offeredPrice,
        description,
        category: subCategory || category,
        subCategory: subCategory || undefined,
        stock,
        image: images,
        colors, // Add colors here
        user: userId, // Use the dynamically determined userId
    });

    return NextResponse.json({
        success: true,
        product,
    }, { status: 201 });
});