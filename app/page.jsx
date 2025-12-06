import React from 'react';
import ImageSlider from '@/components/ImageSlider';
import Categories from '@/components/Categories';
import Product from '@/components/Product';
import Loader from '@/components/Loader';
import ProductTabs from '@/components/ProductTabs';
import '@/pageStyles/Home.css';

async function getProducts() {
  const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${baseURL}/api/products/trending`, { next: { revalidate: 10 } }); // Revalidate every 10 seconds
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Home() {
  let products = [];
  let loading = true;
  let error = null;

  try {
    const data = await getProducts();
    products = data.products;
    loading = false;
  } catch (err) {
    error = err.message;
    loading = false;
  }


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ImageSlider /> 
          <Categories />
          <div className="home-container">
            <h2 className="home-heading">
              trending new
            </h2>
            <div className="home-product-container">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <Product product={product} key={product._id} hideAddToCartButton={true} />
                ))
              ) : (
                <p>No trending products found.</p>
              )}
            </div>
          </div>
         <ProductTabs />
        </>
      )}
    </>
  );
}
