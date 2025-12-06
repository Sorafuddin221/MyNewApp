import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel';
import APIFunctionality from '@/utils/apiFunctionality';
// import HandleError from '@/utils/handleError'; // Not used, can be removed

export async function GET(req) {
    await connectMongoDatabase();
    const { searchParams } = new URL(req.url);
    let queryStr = Object.fromEntries(searchParams.entries()); // Use let as queryStr will be modified



    try {
        const resultsPerPage = 6;
        let baseQuery = Product.find(); // Start with a base Mongoose query

        const tabKeyword = queryStr.keyword; // Store the keyword for tab logic
        const specialKeywords = ['featured', 'new-arrival', 'offer'];

        // --- Tab-specific logic ---
        if (specialKeywords.includes(tabKeyword)) {
            // Remove 'keyword' from queryStr to prevent APIFunctionality.search() from using it
            delete queryStr.keyword; 

            if (tabKeyword === 'new-arrival') {
                queryStr.sort = '-createdAt'; // Set sort for new arrivals
            } else if (tabKeyword === 'offer') {
                // Filter by offeredPrice existing and not null
                baseQuery = baseQuery.where('offeredPrice').exists(true).ne(null);
            } else if (tabKeyword === 'featured') {
                queryStr.sort = '-ratings'; // Sort by ratings for featured
            }
        }
        // --- End Tab-specific logic ---


        // Apply other API functionalities
        const apiFeatures = new APIFunctionality(baseQuery, queryStr)
            .search() // Will only apply if general 'keyword' exists in queryStr (not if it was a tab keyword)
            .filter() // Will apply other filters like price, category etc. and now offeredPrice if set
            .sort(); // This will now use queryStr.sort or default to '-createdAt'


        const filteredQuery = apiFeatures.query.clone();
        const productCount = await filteredQuery.countDocuments();
        
        const totalPages = Math.ceil(productCount / resultsPerPage);
        const page = Number(queryStr.page) || 1;

        if (page > totalPages && productCount > 0) {
            return NextResponse.json({ message: "This page does not exist" }, { status: 404 });
        }

        apiFeatures.pagination(resultsPerPage);
        
        const products = await apiFeatures.query.populate('category');
        
        if (!products || products.length === 0) {
            return NextResponse.json({ success: true, products: [], productCount: 0, resultsPerPage: 6, totalPages: 0, currentpage: 1 }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            products,
            productCount,
            resultsPerPage,
            totalPages,
            currentpage: page
        }, { status: 200 });

    } catch (error) {
        console.error("Error in /api/products GET:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}