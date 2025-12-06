import ProductModel from '@/models/productModel'; // Import the server-side model
import connectMongoDatabase from '@/lib/db'; // Import your DB connection
import ProductDetailsClientComponent from '@/components/ProductDetailsClientComponent'; // Import the client component

// This function will run on the server
export default async function ProductDetailsPage({ params }) {
  
  let id;
  // This is a workaround for an unusual environment where 'params' is a Promise.
  // The standard Next.js behavior is for 'params' to be a plain object.
  if (params && typeof params.then === 'function') { 
    try {
      const resolvedParams = await params;
      id = resolvedParams.id;
    } catch (err) {
      console.error("Error resolving 'params' Promise.", err);
      return <p>Error: Could not resolve product route parameters.</p>;
    }
  } else {
    id = params.id;
  }

  // If id is still not resolved, we cannot proceed.
  if (!id) {
    console.error("Product ID could not be determined from params.");
    return <p>Error: Product ID not found in URL.</p>;
  }


  await connectMongoDatabase(); // Connect to your database

  let product = null;
  try {
    // Fetch product directly using Mongoose
    const fetchedProduct = await ProductModel.findById(id).populate('category');
    product = fetchedProduct ? JSON.parse(JSON.stringify(fetchedProduct)) : null;

    // Increment viewsCount
    if (fetchedProduct) {
        await ProductModel.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });
    }

  } catch (error) {
    console.error("Error fetching product in Server Component:", error);
    // You might want to handle this error more gracefully, e.g., show a 404 or error page
  }

  // Pass the fetched product data to the Client Component
  return (
    <ProductDetailsClientComponent initialProduct={product} productId={id} />
  );
}