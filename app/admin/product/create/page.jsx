'use client';

import React, { useEffect, useState } from 'react';
import '@/AdminStyles/CreateProduct.css';
import PageTitle from '@/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, removeErrors, removeSuccess } from '@/features/admin/adminSlice';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '@/features/category/categorySlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
    { ssr: false }
);
function CreateProductPage() {
    const { success, loading, error } = useSelector(state => state.admin);
    const { categories, loading: categoryLoading, error: categoryError } = useSelector(state => state.category);
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [offeredPrice, setOfferedPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState("");
    const [newCategoryImagePreview, setNewCategoryImagePreview] = useState("");
    const [editingCategoryImage, setEditingCategoryImage] = useState("");
    const [editingCategoryImagePreview, setEditingCategoryImagePreview] = useState("");

    const handleAddCategory = async () => {
        if (newCategory.trim() !== "" && newCategoryImage !== "") {
            const formData = new FormData();
            formData.set('name', newCategory);
            formData.set('image', newCategoryImage); // Assuming newCategoryImage is a File object or base64 string
            await dispatch(createCategory(formData));
            setNewCategory("");
            setNewCategoryImage("");
            setNewCategoryImagePreview("");
            dispatch(getAllCategories()); // Refresh categories after adding
        }
    };

    const handleEditCategory = (id, name, image) => {
        setEditingCategory(id);
        setEditedCategoryName(name);
        setEditingCategoryImagePreview(image && image.length > 0 ? image[0].url : "");
        setEditingCategoryImage(image && image.length > 0 ? image[0].url : "");
    };

    const handleSaveEditedCategory = async () => {
        if (editedCategoryName.trim() !== "") {
            const formData = new FormData();
            formData.set('name', editedCategoryName);
            if (editingCategoryImage) {
                formData.set('image', editingCategoryImage);
            }
            await dispatch(updateCategory({ id: editingCategory, categoryData: formData }));
            setEditingCategory(null);
            setEditedCategoryName("");
            setEditingCategoryImage("");
            setEditingCategoryImagePreview("");
            dispatch(getAllCategories()); // Refresh categories after editing
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditedCategoryName("");
        setEditingCategoryImage("");
        setEditingCategoryImagePreview("");
    };

    const handleDeleteCategory = async (id) => {
        await dispatch(deleteCategory(id));
        dispatch(getAllCategories()); // Refresh categories after deleting
    };

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const createProductSubmit = async (e) => {
        e.preventDefault();

        // 1. Upload images first using the new /api/upload endpoint
        let uploadedImages = [];
        if (image.length > 0) {
            const imageUploadForm = new FormData();
            image.forEach((img) => {
                imageUploadForm.append("image", img);
            });

            try {
                const uploadResponse = await axios.post('/api/upload', imageUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (uploadResponse.data.success) {
                    uploadedImages = uploadResponse.data.images;
                } else {
                    toast.error(uploadResponse.data.message || "Image upload failed", { position: 'top-center', autoClose: 3000 });
                    return; // Stop product creation if image upload fails
                }
            } catch (uploadError) {
                toast.error(uploadError.response?.data?.message || "Image upload failed due to network error", { position: 'top-center', autoClose: 3000 });
                return; // Stop product creation if image upload fails
            }
        }

        // 2. Prepare product data with uploaded image details
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('offeredPrice', offeredPrice);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        // Send image details as JSON string
        myForm.set('images', JSON.stringify(uploadedImages)); 

        // 3. Dispatch product creation with image metadata
        await dispatch(createProduct(myForm));
    };

    const createProductImage = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            toast.error("You can only upload a maximum of 5 images.", { position: 'top-center', autoClose: 3000 });
            return;
        }

                setImage([]);

                setImagePreview([]);

                files.forEach((file) => {

                    if (file.size > 5 * 1024 * 1024) { // 5 MB

                        toast.error(`${file.name} is too large. Maximum file size is 5MB.`, { position: 'top-center', autoClose: 3000 });

                        return;

                    }

                    setImage((old) => [...old, file]);

                    const reader = new FileReader();

                    reader.onload = () => {

                        if (reader.readyState === 2) {

                            setImagePreview((old) => [...old, reader.result]);

                        }

                    };

                    reader.readAsDataURL(file);

                });
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success("product Create successfully", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            setName("");
            setPrice("");
            setOfferedPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setImage([]);
            setImagePreview([]);
        }
    }, [dispatch, error, success]);

    return (
        <>
            <PageTitle title="Create Product" />
            <div className="create-product-container">
                <h1 className='form-title'> Create Product</h1>
                <form onSubmit={createProductSubmit} className='product-form' encType='multipart/form-data'>
                    <input value={name} onChange={(e) => setName(e.target.value)} name='name' type="text" className="form-input" placeholder='Enter Product Name' required />
                    <input value={price} onChange={(e) => setPrice(e.target.value)} name='Price' type="number" className="form-input" placeholder='Enter Product Price' required />
                    <input value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} name='offeredPrice' type="number" className="form-input" placeholder='Enter Offered Price' />



                    <Editor
                        apiKey="YOUR_TINYMCE_API_KEY" // Replace with your actual TinyMCE API key
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help'
                        }}
                        value={description}
                        onEditorChange={(content, editor) => setDescription(content)}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} name='category' id="" className="form-select">
                        <option value="" required >Choose a Category</option>
                        {categories && categories.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                    <input value={stock} onChange={(e) => setStock(e.target.value)} name='stock' type="text" className="form-input" placeholder='Enter Product Stock' required />
                    <div className="file-input-container">
                        <input onChange={createProductImage} name='image' type="file" className="form-input-file" accept='image/*' multiple />
                    </div>
                    <div className="image-preview-container">
                        {imagePreview.map((img, index) => (
                            <img src={img} alt="Product Preview" className='image-preview' key={index} />
                        ))}
                    </div>
                    <button className="submit-btn" disabled={loading}>{loading ? 'Creating Product...' : 'Create'}</button>
                </form>
                                <div className="category-management-container">
                                <h1 className='form-title'>Manage Categories</h1>
                    <div className="add-category-form">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <div className="file-input-container">
                            <input
                                type="file"
                                className="form-input-file"
                                accept='image/*'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setNewCategoryImage(file); // Set the file object for submission
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (reader.readyState === 2) {
                                            setNewCategoryImagePreview(reader.result); // Set the base64 string for preview
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>
                        {newCategoryImagePreview && (
                            <img src={newCategoryImagePreview} alt="Category Preview" className="image-preview" />
                        )}
                        <button className="submit-btn" onClick={handleAddCategory}>Add Category</button>
                    </div>
                    <div className="category-list">
                        {categories && categories.map((categoryItem) => (
                            <div key={categoryItem._id} className="category-item">
                                {editingCategory === categoryItem._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editedCategoryName}
                                            onChange={(e) => setEditedCategoryName(e.target.value)}
                                        />
                                        <div className="file-input-container">
                                            <input
                                                type="file"
                                                className="form-input-file"
                                                accept='image/*'
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    setEditingCategoryImage(file); // Set the file object for submission
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setEditingCategoryImagePreview(reader.result); // Set the base64 string for preview
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </div>
                                        {editingCategoryImagePreview && (
                                            <img src={editingCategoryImagePreview} alt="Category Preview" className="image-preview" />
                                        )}
                                        <div className="category-item-buttons">
                                            <button className="submit-btn" onClick={handleSaveEditedCategory}>Save</button>
                                            <button className="submit-btn" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>{categoryItem.name}</span>
                                        {categoryItem.image && categoryItem.image.length > 0 && (
                                            <img src={categoryItem.image[0].url} alt="Category" className="category-image-small" />
                                        )}
                                        <div className="category-item-buttons">
                                            <button className="submit-btn" onClick={() => handleEditCategory(categoryItem._id, categoryItem.name, categoryItem.image)}>Edit</button>
                                            <button className="submit-btn" onClick={() => handleDeleteCategory(categoryItem._id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateProductPage;
