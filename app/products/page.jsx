import React from 'react';

export const dynamic = 'force-dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';
import '@/pageStyles/Products.css';
import Product from '@/components/Product';
import NoProducts from '@/components/NoProducts';
import Pagination from '@/components/Pagination';
import Category from '@/models/categoryModel';
import connectMongoDatabase from '@/lib/db';
import ProductModel from '@/models/productModel';
import APIFunctionality from '@/utils/apiFunctionality';
import Filters from '@/components/Filters';
import { getServerSession } from 'next-auth'; // Assuming next-auth is or will be used

async function getProducts({ keyword, category, page = 1 }) {
  await connectMongoDatabase();
  let queryStr = {};
  if (keyword) {
    queryStr.keyword = keyword;
  }
  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    if (categoryDoc) {
      queryStr.category = categoryDoc._id.toString();
    } else {
      queryStr.category = '000000000000000000000000';
    }
  }

  const resultsPerPage = 6; // This should match what's in the API
  const apiFeatures = new APIFunctionality(ProductModel.find(), queryStr)
    .search()
    .filter()
    .sort('-createdAt');

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
  const categories = await Category.find({});
  return JSON.parse(JSON.stringify(categories));
}

export default async function ProductsPage({ searchParams }) {
  let resolvedSearchParams;
  // This is a workaround for an unusual environment where searchParams is a Promise.
  if (searchParams && typeof searchParams.then === 'function') {
    resolvedSearchParams = await searchParams;
  } else {
    resolvedSearchParams = searchParams;
  }
  
  const { keyword, category, page } = resolvedSearchParams;
  const { products, productCount, totalPages, currentPage } = await getProducts({ keyword, category, page });
  const categories = await getCategories();

  return (
    <>
    
      <PageTitle title="All Products" />
      {/* Navbar and Footer are in layout.jsx, no need to include here */}
      <div className='products-layout'>
        <Filters categories={categories} /> {/* This will be a client component */}
        <div className="products-section">
          {products && products.length > 0 ? (
            <div className="products-product-container">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProducts keyword={keyword} />
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}
