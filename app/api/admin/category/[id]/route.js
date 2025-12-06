import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Category from '@/models/categoryModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import { v2 as cloudinary } from 'cloudinary';
import HandleError from '@/utils/handleError';

export async function PUT(req, context) {
    await connectMongoDatabase();
    const { id } = await context.params;

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        let category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const name = formData.get('name');
        const imageFile = formData.get('image');

        const newData = {
            name,
        };

        // Handle image updates
        if (imageFile && typeof imageFile !== 'string') { // Check if a new file is provided
            // Destroy old image
            if (category.image && category.image.length > 0 && category.image[0].public_id) {
                await cloudinary.uploader.destroy(category.image[0].public_id);
            }

            // Upload new image
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: 'categories',
                }, (error, uploadResult) => {
                    if (error) {
                        return reject(new HandleError("Cloudinary upload failed", 500));
                    }
                    if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                        return reject(new HandleError("Cloudinary upload did not return a valid result.", 500));
                    }
                    resolve(uploadResult);
                }).end(buffer);
            });
            newData.image = [{
                public_id: result.public_id,
                url: result.secure_url,
            }];
        }

        category = await Category.findByIdAndUpdate(id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        return NextResponse.json({
            success: true,
            category: JSON.parse(JSON.stringify(category)),
        }, { status: 200 });

    } catch (error) {
        console.error(error); // Log the full error for debugging
        if (error.code === 11000) {
            return NextResponse.json({ message: "Category with this name already exists" }, { status: 400 });
        }
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Category ID: ${id}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    await connectMongoDatabase();
    const { id } = await context.params;

    try {
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        // Destroy image from cloudinary
        if (category.image && category.image.length > 0 && category.image[0].public_id) {
            await cloudinary.uploader.destroy(category.image[0].public_id);
        }

        await category.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Category Deleted Successfully",
        }, { status: 200 });

    } catch (error) {
        console.error(error); // Log the full error for debugging
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Category ID: ${id}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
