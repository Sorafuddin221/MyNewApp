import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';

export async function GET(request) {
    await connectMongoDatabase();
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const excludeProductId = searchParams.get('excludeProductId');

        if (!categoryId) {
            return NextResponse.json({ message: "Category ID is required." }, { status: 400 });
        }

        let query = { category: categoryId };
        if (excludeProductId) {
            // Exclude the current product from related products
            query._id = { $ne: excludeProductId };
        }

        // Fetch related products (e.g., limit to 4 or 8)
        const relatedProducts = await Product.find(query).limit(4);

        return NextResponse.json({
            success: true,
            products: relatedProducts,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching related products:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
