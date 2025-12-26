import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel';
import Order from '@/models/orderModel';
import APIFunctionality from '@/utils/apiFunctionality';
// import HandleError from '@/utils/handleError'; // Not used, can be removed

export async function GET(req) {
    await connectMongoDatabase();
    const { searchParams } = new URL(req.url);
    let queryStr = Object.fromEntries(searchParams.entries());

    const discountParam = searchParams.get('discount');
    const typeParam = searchParams.get('type'); // New: Get 'type' parameter
    const tabKeyword = queryStr.keyword;
    const page = Number(queryStr.page) || 1;
    const resultsPerPage = 6;

    try {
        if (tabKeyword === 'top-selling') {
            const countResult = await Order.aggregate([
                { $unwind: "$orderItems" },
                { $group: { _id: "$orderItems.product" } },
                { $count: "total" }
            ]);
            const productCount = countResult.length > 0 ? countResult[0].total : 0;
            const totalPages = Math.ceil(productCount / resultsPerPage);

            if (page > totalPages && productCount > 0) {
                return NextResponse.json({ message: "This page does not exist" }, { status: 404 });
            }

            const topSellingProducts = await Order.aggregate([
                { $unwind: "$orderItems" },
                {
                    $group: {
                        _id: "$orderItems.product",
                        totalQuantity: { $sum: "$orderItems.quantity" }
                    }
                },
                { $sort: { totalQuantity: -1 } },
                { $skip: resultsPerPage * (page - 1) },
                { $limit: resultsPerPage },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                { $unwind: "$product" },
                { $replaceRoot: { newRoot: "$product" } }
            ]);

            const populatedProducts = await Product.populate(topSellingProducts, { path: 'category' });

            return NextResponse.json({
                success: true,
                products: populatedProducts,
                productCount,
                resultsPerPage,
                totalPages,
                currentpage: page
            }, { status: 200 });

        } else if (discountParam) {
            const discountValue = Number(discountParam);
            if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
                return NextResponse.json({ message: "Invalid discount value provided." }, { status: 400 });
            }

            let aggregationPipeline = [
                {
                    $match: {
                        price: { $exists: true, $ne: null, $gt: 0 },
                        offeredPrice: { $exists: true, $ne: null, $gte: 0 } 
                    }
                },
                {
                    $addFields: {
                        discountPercentage: {
                            $cond: {
                                if: { $gt: ["$price", 0] },
                                then: { $multiply: [{ $subtract: [1, { $divide: ["$offeredPrice", "$price"] }] }, 100] },
                                else: 0
                            }
                        }
                    }
                },
                {
                    $match: {
                        discountPercentage: { $gte: discountValue }
                    }
                }
            ];

            const countPipeline = [...aggregationPipeline, { $count: "total" }];
            const countResult = await Product.aggregate(countPipeline);
            const productCount = countResult.length > 0 ? countResult[0].total : 0;

            const totalPages = Math.ceil(productCount / resultsPerPage);

            if (page > totalPages && productCount > 0) {
                return NextResponse.json({ message: "This page does not exist" }, { status: 404 });
            }

            const sortBy = queryStr.sort || '-discountPercentage'; 
            let sortStage = {};
            if (sortBy.startsWith('-')) {
                sortStage[sortBy.substring(1)] = -1;
            } else {
                sortStage[sortBy] = 1;
            }

            aggregationPipeline.push({ $sort: sortStage });
            aggregationPipeline.push({ $skip: resultsPerPage * (page - 1) });
            aggregationPipeline.push({ $limit: resultsPerPage });
            
            const products = await Product.aggregate(aggregationPipeline);

            const populatedProducts = await Product.populate(products, { path: 'category' });

            if (!populatedProducts || populatedProducts.length === 0) {
                return NextResponse.json({ success: true, products: [], productCount: 0, resultsPerPage: resultsPerPage, totalPages: 0, currentpage: 1 }, { status: 200 });
            }

            return NextResponse.json({
                success: true,
                products: populatedProducts,
                productCount,
                resultsPerPage,
                totalPages,
                currentpage: page
            }, { status: 200 });

        } else if (typeParam === 'hot-deals') { // New: Handle 'hot-deals' type
            const discountValue = 20; // Fixed 20% discount for hot deals

            let aggregationPipeline = [
                {
                    $match: {
                        price: { $exists: true, $ne: null, $gt: 0 },
                        offeredPrice: { $exists: true, $ne: null, $gte: 0 } 
                    }
                },
                {
                    $addFields: {
                        discountPercentage: {
                            $cond: {
                                if: { $gt: ["$price", 0] },
                                then: { $multiply: [{ $subtract: [1, { $divide: ["$offeredPrice", "$price"] }] }, 100] },
                                else: 0
                            }
                        }
                    }
                },
                {
                    $match: {
                        discountPercentage: { $gte: discountValue }
                    }
                }
            ];

            const countPipeline = [...aggregationPipeline, { $count: "total" }];
            const countResult = await Product.aggregate(countPipeline);
            const productCount = countResult.length > 0 ? countResult[0].total : 0;

            const totalPages = Math.ceil(productCount / resultsPerPage);

            if (page > totalPages && productCount > 0) {
                return NextResponse.json({ message: "This page does not exist" }, { status: 404 });
            }

            const sortBy = queryStr.sort || '-discountPercentage'; 
            let sortStage = {};
            if (sortBy.startsWith('-')) {
                sortStage[sortBy.substring(1)] = -1;
            } else {
                sortStage[sortBy] = 1;
            }

            aggregationPipeline.push({ $sort: sortStage });
            aggregationPipeline.push({ $skip: resultsPerPage * (page - 1) });
            aggregationPipeline.push({ $limit: resultsPerPage });
            
            const products = await Product.aggregate(aggregationPipeline);

            const populatedProducts = await Product.populate(products, { path: 'category' });

            if (!populatedProducts || populatedProducts.length === 0) {
                return NextResponse.json({ success: true, products: [], productCount: 0, resultsPerPage: resultsPerPage, totalPages: 0, currentpage: 1 }, { status: 200 });
            }

            return NextResponse.json({
                success: true,
                products: populatedProducts,
                productCount,
                resultsPerPage,
                totalPages,
                currentpage: page
            }, { status: 200 });
        
        } else {
            // Existing logic using APIFunctionality
            const specialKeywords = ['featured', 'new-arrival', 'offer', 'top-rated'];

            if (specialKeywords.includes(tabKeyword)) {
                delete queryStr.keyword;

                if (tabKeyword === 'new-arrival') {
                    queryStr.sort = '-createdAt';
                } else if (tabKeyword === 'offer') {
                    // For 'offer', APIFunctionality needs to handle the offeredPrice filter
                    // This will be done in APIFunctionality.filter()
                    queryStr.hasOffer = true; 
                } else if (tabKeyword === 'featured' || tabKeyword === 'top-rated') {
                    queryStr.sort = '-ratings';
                }
            }

            const apiFeatures = new APIFunctionality(Product.find(), queryStr)
                .search();
            
            // Await the filter method since it's now async
            await apiFeatures.filter();

            apiFeatures.sort(); // sort() method in APIFunctionality already handles default or queryStr.sort

            const filteredQuery = apiFeatures.query.clone();
            const productCount = await filteredQuery.countDocuments();
            
            const totalPages = Math.ceil(productCount / resultsPerPage);

            if (page > totalPages && productCount > 0) {
                return NextResponse.json({ message: "This page does not exist" }, { status: 404 });
            }

            apiFeatures.pagination(resultsPerPage);
            
            const products = await apiFeatures.query.populate('category');
            
            if (!products || products.length === 0) {
                return NextResponse.json({ success: true, products: [], productCount: 0, resultsPerPage: resultsPerPage, totalPages: 0, currentpage: 1 }, { status: 200 });
            }

            return NextResponse.json({
                success: true,
                products,
                productCount,
                resultsPerPage,
                totalPages,
                currentpage: page
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Error in /api/products GET:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }

}