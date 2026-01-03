// app/sitemap.js
import ProductModel from '../models/productModel';
import connectMongoDatabase from '../lib/db';

const URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function sitemap() {
  await connectMongoDatabase();
  const products = await ProductModel.find({}, '_id');

  const productUrls = products.map((product) => ({
    url: `${URL}/product/${product._id}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    {
      url: `${URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/about-us`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/login`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/privacy-policy`,
      lastModified: new Date(),
    },
    {
        url: `${URL}/products`,
        lastModified: new Date(),
    },
    {
      url: `${URL}/register`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/terms-and-conditions`,
      lastModified: new Date(),
    },
  ];

  return [...staticUrls, ...productUrls];
}
