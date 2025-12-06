import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import HandleError from '@/utils/handleError';

export async function GET() {
    await connectMongoDatabase();
    try {
        // Fetch products by viewsCount in descending order to get the most viewed products
        // Limit to 8 products as per the previous design.
        const products = await Product.find({}).sort({ viewsCount: -1 }).limit(8); 

        if (!products || products.length === 0) {
            return NextResponse.json({ success: true, products: [] }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            products,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
