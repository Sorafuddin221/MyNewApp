import React from 'react';

export const dynamic = 'force-dynamic';
import PageTitle from '@/components/PageTitle';
import '@/pageStyles/Products.css';
import Category from '@/models/categoryModel';
import connectMongoDatabase from '@/lib/db';
import ProductModel from '@/models/productModel';
import APIFunctionality from '@/utils/apiFunctionality';
import Filters from '@/components/Filters';
import ProductsClientComponent from './ProductsClientComponent'; 

async function getProducts({ keyword, category, subcategory, page = 1 }) {
  await connectMongoDatabase();
  
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
  
  const resultsPerPage = 6; 
  const apiFeatures = new APIFunctionality(ProductModel.find(), queryStr)
    .search();
  
  // Await the filter method since it's now async
  await apiFeatures.filter(); 

  apiFeatures.sort(); 

  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  const totalPages = Math.ceil(productCount / resultsPerPage);

  apiFeatures.pagination(resultsPerPage);
  const products = await apiFeatures.query.populate('category');

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

async function getRecentProducts() {
  await connectMongoDatabase();
  const recentProducts = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .limit(5);
  return JSON.parse(JSON.stringify(recentProducts));
}

export default async function ProductsPage({ searchParams }) {
  let resolvedSearchParams;
  if (searchParams && typeof searchParams.then === 'function') {
    resolvedSearchParams = await searchParams;
  } else {
    resolvedSearchParams = searchParams;
  }
  
    const { keyword, category, subcategory, page } = resolvedSearchParams;
    const { products, productCount, totalPages, currentPage } = await getProducts({ keyword, category, subcategory, page });
    const categories = await getCategories();
    const recentProducts = await getRecentProducts();
  
    return (
      <>
        <PageTitle title="All Products" />
        <div className='products-layout'>
          <Filters categories={categories} recentProducts={recentProducts} />
                        <ProductsClientComponent
                            products={products}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            keyword={keyword}
                            categories={categories}
                            category={category}
                            showSubCategoryCards={false} 
                        />            </div>
      </>
    );
}