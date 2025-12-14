import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import Category from '../../../../models/categoryModel';
import handleAsyncError from '../../../../middleware/handleAsyncError';
import cloudinary from '../../../../lib/cloudinary';

// 1. Create a new category
export const POST = handleAsyncError(async (req) => {
    await db();
    const formData = await req.formData();
    const name = formData.get('name');
    const parent = formData.get('parent');
    const imageFile = formData.get('image'); // Renamed to imageFile to avoid confusion

    const categoryImages = [];

    if (imageFile && imageFile.size) { // More robust check for file object
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: 'categories', // Or 'products' or a specific folder for categories
            }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                resolve(uploadResult);
            }).end(buffer);
        });

        categoryImages.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    const newCategory = new Category({
        name,
        parent: parent || null,
        image: categoryImages,
    });

    await newCategory.save();

    if (parent) {
        const parentCategory = await Category.findById(parent);
        if (parentCategory) {
            parentCategory.subcategories.push(newCategory._id);
            await parentCategory.save();
        }
    }

    return NextResponse.json({
        message: 'Category created successfully',
        category: newCategory,
    }, { status: 201 });
});

// 2. Get all categories
export const GET = handleAsyncError(async (req) => {
    await db();

    const categories = await Category.find({ parent: null }).populate('subcategories');

    return NextResponse.json({
        categories,
    });
});

// 3. Delete a category
export const DELETE = handleAsyncError(async (req) => {
    await db();
    const { id } = await req.json();

    const category = await Category.findById(id);

    if (!category) {
        return NextResponse.json({
            message: 'Category not found',
        }, { status: 404 });
    }

    // If the category is a sub-category, remove it from its parent's subcategories array
    if (category.parent) {
        const parentCategory = await Category.findById(category.parent);
        if (parentCategory) {
            parentCategory.subcategories.pull(id);
            await parentCategory.save();
        }
    }

    // If the category has sub-categories, delete them
    if (category.subcategories && category.subcategories.length > 0) {
        await Category.deleteMany({ _id: { $in: category.subcategories } });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
        message: 'Category deleted successfully',
    });
});

// 4. Update a category
export const PUT = handleAsyncError(async (req) => {
    await db();
    const formData = await req.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const parent = formData.get('parent'); // Parent can also be updated
    const imageFile = formData.get('image'); // New image file

    const category = await Category.findById(id);

    if (!category) {
        return NextResponse.json({
            message: 'Category not found',
        }, { status: 404 });
    }

    category.name = name;
    if (parent) {
        category.parent = parent;
    } else {
        category.parent = null;
    }

    if (imageFile && imageFile.size) { // More robust check for file object
        // Upload new image, potentially delete old one from Cloudinary
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: 'categories',
            }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                resolve(uploadResult);
            }).end(buffer);
        });

        // If there's an old image, you might want to delete it from Cloudinary
        // For simplicity, we're just replacing the image array
        category.image = [{ public_id: result.public_id, url: result.secure_url }];
    } else if (!imageFile && category.image && category.image.length > 0) {
        // If imageFile is null/undefined and old image exists, retain old image.
        // This 'else if' block essentially does nothing if imageFile is not new
        // and image data exists, preserving current image.
    } else {
        // If no imageFile and no existing images, clear the image array
        category.image = [];
    }

    await category.save();

    return NextResponse.json({
        message: 'Category updated successfully',
        category,
    });
});