import React from 'react';

export const dynamic = 'force-dynamic';
import PageTitle from '@/components/PageTitle';
import '@/pageStyles/Products.css';
import Category from '@/models/categoryModel';
import connectMongoDatabase from '@/lib/db';
import ProductModel from '@/models/productModel';
import APIFunctionality from '@/utils/apiFunctionality';
import ProductsClientComponent from '../ProductsClientComponent'; 

async function getProducts({ category, subcategory, page = 1, keyword }) {
    await connectMongoDatabase();
    
    console.log("getProducts called with:", { category, subcategory, page, keyword });

    let queryStr = { page }; 
    if (keyword) {
      queryStr.keyword = keyword;
    }
    // Pass category and subcategory names to queryStr for APIFunctionality to handle
    if (category) {
        queryStr.category = category;
    }
    if (subcategory) {
        queryStr.subcategory = subcategory;
    }
    console.log("queryStr passed to APIFunctionality:", queryStr);
  
    const resultsPerPage = 6; 
    const apiFeatures = new APIFunctionality(ProductModel.find(), queryStr)
        .search();
    
    // Await the filter method since it's now async
    await apiFeatures.filter(); 

    apiFeatures.sort();

    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    console.log("Product count after filtering:", productCount);

    const totalPages = Math.ceil(productCount / resultsPerPage);

    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query.populate('category');
    console.log("Number of products retrieved:", products.length);

    return {
        products: JSON.parse(JSON.stringify(products)),
        productCount,
        resultsPerPage,
        totalPages,
        currentPage: parseInt(page, 10),
    };
}

async function getCategories() {
    await connectMongoDatabase();
    const categories = await Category.find({ parent: null }).populate('subcategories');
    return JSON.parse(JSON.stringify(categories));
}

export default async function CategoryProductsPage({ params, searchParams }) {
    let resolvedParams;
    if (params && typeof params.then === 'function') {
        resolvedParams = await params;
    } else {
        resolvedParams = params;
    }

    let resolvedSearchParams;
    if (searchParams && typeof searchParams.then === 'function') {
        resolvedSearchParams = await searchParams;
    } else {
        resolvedSearchParams = searchParams;
    }

    const categoryName = decodeURIComponent(resolvedParams.category);
    const { subcategory, page, keyword } = resolvedSearchParams;

    const { products, productCount, totalPages, currentPage } = await getProducts({ category: categoryName, subcategory, page, keyword });
    const allCategories = await getCategories();

    return (
        <>
            <PageTitle title={`Products in ${categoryName}`} />
            <div className='products-layout-no-sidebar'>
                <ProductsClientComponent
                    products={products}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    keyword={keyword}
                    categories={allCategories}
                    category={categoryName}
                    showSubCategoryCards={true}
                />
            </div>
        </>
    );
}
