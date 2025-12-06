import { NextResponse } from 'next/server';
import connectMongoDatabase from '@/lib/db';
import Product from '@/models/productModel';
import { verifyUserAuth, roleBasedAccess } from '@/middleware/auth';
import cloudinary from '@/lib/cloudinary';
import HandleError from '@/utils/handleError';

export async function PUT(req, { params }) {
    let id;
    try {
        await connectMongoDatabase();
        id = req.nextUrl.pathname.split('/').pop();

        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        let product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const offeredPrice = formData.get('offeredPrice');
        const category = formData.get('category');
        const tags = formData.get('tags');
        const stock = formData.get('stock');
        const imageFiles = formData.getAll('image');

        const newData = {
            name,
            description,
            price,
            offeredPrice,
            category,
            tags,
            stock,
        };

        // Handle image updates
        if (imageFiles && imageFiles.length > 0 && typeof imageFiles[0] !== 'string') {
            // Destroy old images
            for (let i = 0; i < product.image.length; i++) {
                await cloudinary.uploader.destroy(product.image[i].public_id);
            }

            // Upload new images
            let imageLinks = [];
            for (const imageFile of imageFiles) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({
                        folder: 'products',
                    }, (error, uploadResult) => {
                        if (error) {
                            return reject(new HandleError("Cloudinary upload failed", 500));
                        }
                        resolve(uploadResult);
                    }).end(buffer);
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            newData.image = imageLinks;
        }

        product = await Product.findByIdAndUpdate(id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        return NextResponse.json({
            success: true,
            product: JSON.parse(JSON.stringify(product)),
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Product ID: ${id}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    let id;
    try {
        await connectMongoDatabase();
        id = req.nextUrl.pathname.split('/').pop();
        
        const authResult = await verifyUserAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ message: authResult.error.message }, { status: authResult.statusCode });
        }
        const user = authResult.user;

        const roleAccessResult = roleBasedAccess(['admin'])(req, user);
        if (!roleAccessResult.hasAccess) {
            return NextResponse.json({ message: roleAccessResult.error.message }, { status: roleAccessResult.statusCode });
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Destroy images from cloudinary
        if (product.image && Array.isArray(product.image)) {
            for (let i = 0; i < product.image.length; i++) {
                if (product.image[i] && product.image[i].public_id) {
                    await cloudinary.uploader.destroy(product.image[i].public_id);
                }
            }
        }

        await product.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Product Deleted Successfully",
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'CastError') {
            return NextResponse.json({ message: `Invalid Product ID: ${id}` }, { status: 400 });
        }
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}
