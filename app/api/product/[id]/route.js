import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';

export async function GET(req, { params }) {
    await connectMongoDatabase();
    
    let id;
    // This is a workaround for an unusual environment where 'params' is a Promise.
    if (params && typeof params.then === 'function') {
        const resolvedParams = await params;
        id = resolvedParams.id;
    } else {
        id = params.id;
    }

    if (!id || id === 'undefined') {
        return NextResponse.json({ message: "Invalid Product ID provided." }, { status: 400 });
    }

    console.log(`[API /api/product/${id}] Received request for product ID: ${id}`); // Log received ID

    try {
        const product = await Product.findById(id).populate('category');

        console.log(`[API /api/product/${id}] Product found: ${product ? product._id : 'None'}`); // Log product found

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product,
        }, { status: 200 });

    } catch (error) {
        console.error(`[API /api/product/${id}] Error fetching product:`, error); // Log any caught errors
        // Mongoose CastError for invalid ObjectId
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Product ID: ${id}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}