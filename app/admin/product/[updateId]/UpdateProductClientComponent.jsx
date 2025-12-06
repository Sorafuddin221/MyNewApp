'use client';

import React, { useEffect, useState } from 'react';
import '@/AdminStyles/CreateProduct.css';
import PageTitle from '@/components/PageTitle';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getProductDetails, setProduct } from '@/features/products/productSlice';
import { removeErrors, removeSuccess, updateProduct } from '@/features/admin/adminSlice';
import Loader from '@/components/Loader';
import { setCategories } from '@/features/category/categorySlice';

export function UpdateProductClient({ updateId, initialProduct, initialCategories }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [offeredPrice, setOfferedPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [oldImage, setOldImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    const { success, error, loading } = useSelector(state => state.admin);
    const { categories } = useSelector(state => state.category);
    const { product } = useSelector(state => state.product);

    const dispatch = useDispatch();
    const router = useRouter();

    // Use the initial data passed from the Server Component
    useEffect(() => {
        if (initialProduct) {
            dispatch(setProduct(initialProduct)); // Set initial product in redux store
        }
        if (initialCategories) {
            dispatch(setCategories(initialCategories)); // Set initial categories in redux store
        }
    }, [initialProduct, initialCategories, dispatch]);
    
    // This effect now only runs when the product state changes, not for initial fetching
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setPrice(product.price || "");
            setOfferedPrice(product.offeredPrice || "");
            setDescription(product.description || "");
            setCategory(product.category?._id || product.category || "");
            setStock(product.stock || "");
            setOldImage(product.image || []);
        }
    }, [product]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            toast.error("You can only upload a maximum of 5 images.", { position: 'top-center', autoClose: 3000 });
            return;
        }
        setImage([]);
        setImagePreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result]);
                    setImage((old) => [...old, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const updateProductSubmit = async (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('offeredPrice', offeredPrice);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        image.forEach((img) => {
            myForm.append("image", img);
        });
        await dispatch(updateProduct({ id: updateId, formData: myForm }));
    };

    useEffect(() => {
        if (success) {
            toast.success("Product Updated Successfully", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            router.push('/admin/products');
        }
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, success, error, router]);
    
    if(!initialProduct) return <div>Product not found or failed to load.</div>;

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <PageTitle title='Update Product' />
                    <div className="update-product-wrapper create-product-container">
                        <h1 className="update-product-title form-title">Update Product</h1>
                        <form onSubmit={updateProductSubmit} className="update-product-form product-form" encType='multipart/form-data'>
                            {/* Form inputs */}
                            <label htmlFor="name">Product Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} name='name' type="text" className='update-product-input form-input' required id='name' />
                            <label htmlFor="price">Product Price</label>
                            <input onChange={(e) => setPrice(e.target.value)} value={price} name='price' type="number" className='update-product-input form-input' required id='price' />
                            <label htmlFor="offeredPrice">Offered Price</label>
                            <input onChange={(e) => setOfferedPrice(e.target.value)} value={offeredPrice} name='offeredPrice' type="number" className='update-product-input form-input' id='offeredPrice' />
                            <label htmlFor="description">Product Description</label>
                            <textarea onChange={(e) => setDescription(e.target.value)} value={description} name='description' className='update-product-textarea form-input' required id='description' />
                            <label htmlFor="category">Product Category</label>
                            <select onChange={(e) => setCategory(e.target.value)} value={category} className='update-product-select form-select' name="category" id="category">
                                <option value="">Choose a Category</option>
                                {categories && categories.map((item) => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))}
                            </select>
                            <label htmlFor="stock">Product Stock</label>
                            <input onChange={(e) => setStock(e.target.value)} value={stock} name='stock' type="number" className='update-product-input form-input' required id='stock' />
                            <label htmlFor="image">Product images</label>
                            <div className="update-product-file-wrapper file-input-container">
                                <input onChange={handleImageChange} type="file" accept='image/' name="image" multiple className='update-product-file-input form-input-file' id="" />
                            </div>
                            <div className="update-product-preview-wrapper image-preview-container">
                                {imagePreview.map((img, index) => (
                                    <img src={img} key={index} alt="Product Preview" className="update-product-preview-image image-preview" />
                                ))}
                            </div>
                            <div className="update-product-old-images-wrapper image-preview-container">
                                {oldImage && oldImage.map((img, index) => (
                                    <img key={index} src={img.url} alt="Old Product Preview" className='update-product-old-image image-preview' />
                                ))}
                            </div>
                            <button className='update-product-submit-btn submit-btn' disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}
