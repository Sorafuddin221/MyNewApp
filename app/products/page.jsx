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

async function getProducts(resolvedSearchParams) {
  await connectMongoDatabase();

    // Convert resolvedSearchParams to a plain object
    const queryObj = {};
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
        queryObj[key] = value;
    }

  const limit = Number(queryObj.limit) || 6;
  const page = Number(queryObj.page) || 1;

  const apiFeatures = new APIFunctionality(ProductModel.find(), queryObj)
    .search();

  await apiFeatures.filter();

  apiFeatures.sort();

  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  const totalPages = Math.ceil(productCount / limit);

  apiFeatures.pagination();
  const products = await apiFeatures.query.populate('category');

  return {
    products: JSON.parse(JSON.stringify(products)),
    productCount,
    resultsPerPage: limit,
    totalPages,
    currentPage: page,
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

    const { products, productCount, totalPages, currentPage, resultsPerPage } = await getProducts(resolvedSearchParams);
    const categories = await getCategories();
    const recentProducts = await getRecentProducts();

    const currentCategory = categories.find(cat => cat.name === resolvedSearchParams.category);
    const showSubCategoryCards = currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && !resolvedSearchParams.subcategory;

    return (
      <>
        <PageTitle title="All Products" />
        <div className='products-layout'>
          <Filters categories={categories} recentProducts={recentProducts} />
                        <ProductsClientComponent
                            products={products}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            keyword={resolvedSearchParams.keyword}
                            categories={categories}
                            category={resolvedSearchParams.category}
                            showSubCategoryCards={showSubCategoryCards}
                            resultsPerPage={resultsPerPage}
                        />            </div>
      </>
    );
}