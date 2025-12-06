import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Category from '@/models/categoryModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import cloudinary from '@/lib/cloudinary';
import HandleError from '@/utils/handleError';

export async function POST(req) {
    await connectMongoDatabase();

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

        const formData = await req.formData();
        const name = formData.get('name');
        const imageFile = formData.get('image');

        if (!name) {
            return NextResponse.json({ message: "Please enter category name" }, { status: 400 });
        }

        const categoryData = { name };

        // Upload image to Cloudinary if it exists
        if (imageFile && typeof imageFile !== 'string') {
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

            categoryData.image = [{
                public_id: result.public_id,
                url: result.secure_url,
            }];
        }
        
        const category = await Category.create(categoryData);

        return NextResponse.json({
            success: true,
            category: JSON.parse(JSON.stringify(category)),
        }, { status: 201 });

    } catch (error) {
        console.error(error); // Log the full error for debugging
        if (error.code === 11000) {
            return NextResponse.json({ message: "Category with this name already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
