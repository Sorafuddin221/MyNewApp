import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import HandleError from '@/utils/handleError';

export async function GET() {
    await connectMongoDatabase();
    try {
        const products = await Product.find({});

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
