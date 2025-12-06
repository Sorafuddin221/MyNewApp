
import connectMongoDatabase from './db';
import Category from '@/models/categoryModel';
import ProductModel from '@/models/productModel';
import APIFunctionality from '@/utils/apiFunctionality';

export async function getProducts({ keyword, category, page = 1, price, rating, sort }) {
  await connectMongoDatabase();

  let queryStr = {
    keyword,
    category,
    page,
    price,
    rating,
    sort,
  };

  const categoryDoc = await Category.findOne({ name: category });
  if (categoryDoc) {
    queryStr.category = categoryDoc._id.toString();
  } else if (category) {
    // If a category is specified but not found, return no products
    return {
      products: [],
      productCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }

  const resultsPerPage = 6;
  const apiFeatures = new APIFunctionality(ProductModel.find(), queryStr)
    .search()
    .filter()
    .sort(sort);

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

export async function getCategories() {
  await connectMongoDatabase();
  const categories = await Category.find({});
  return JSON.parse(JSON.stringify(categories));
}
