import { UpdateProductClient } from './UpdateProductClientComponent';
import { getUpdateProductData } from './_data';

// --- Server Component (Default Export) ---
export default async function UpdateProductPage({ params }) {
    let updateId;
    if (params && typeof params.then === 'function') {
        try {
            const resolvedParams = await params;
            updateId = resolvedParams.updateId;
        } catch (err) {
            console.error("Error resolving 'params' Promise.", err);
            return <p>Error: Could not resolve product ID for update.</p>;
        }
    } else {
        updateId = params.updateId;
    }
    
    const { initialProduct, initialCategories } = await getUpdateProductData(updateId);

    return <UpdateProductClient updateId={updateId} initialProduct={initialProduct} initialCategories={initialCategories} />;
}
