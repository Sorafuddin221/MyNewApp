import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Category from '@/models/categoryModel';

export async function GET() {
    await connectMongoDatabase();

    try {
        const categories = await Category.find({ parent: null }).populate('subcategories');

        return NextResponse.json({
            success: true,
            categories,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
