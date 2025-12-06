import ProductModel from '@/models/productModel';
import CategoryModel from '@/models/categoryModel';
import connectMongoDatabase from '@/lib/db';

export async function getUpdateProductData(updateId) {
    let initialProduct = null;
    let initialCategories = [];

    if (updateId && updateId !== 'undefined') {
        try {
            await connectMongoDatabase();
            const productPromise = ProductModel.findById(updateId).populate('category').lean();
            const categoriesPromise = CategoryModel.find({}).lean();

            const [productResult, categoriesResult] = await Promise.all([productPromise, categoriesPromise]);

            if (productResult) {
                initialProduct = JSON.parse(JSON.stringify(productResult));
            }
            if (categoriesResult) {
                initialCategories = JSON.parse(JSON.stringify(categoriesResult));
            }
        } catch (error) {
            console.error("Error fetching initial data in Server Component:", error);
        }
    }
    return { initialProduct, initialCategories };
}
