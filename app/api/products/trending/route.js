import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import HandleError from '@/utils/handleError';

export async function GET() {
    await connectMongoDatabase();
    try {
        // --- START Modification for Trending Products ---
        // TODO: Define what 'trending' means for your application and modify this query.
        // For example, you might have a field like 'isTrending: true' in your product model,
        // or you might sort by 'views', 'salesCount', 'createdAt' (for new arrivals) etc.
        // For demonstration, we're fetching products marked as isTrending and limiting to 8.
        const products = await Product.find({ isTrending: true }).limit(8); // Fetches trending products and limits to 8
        // --- END Modification for Trending Products ---

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
