// app/api/upload/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const images = [];

        for (const [key, value] of formData.entries()) {
            if (key === 'image' && value instanceof File) {
                const arrayBuffer = await value.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                try {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({
                            folder: 'products',
                        }, (error, uploadResult) => {
                            if (error) {
                                console.error("Cloudinary upload_stream error:", error); // Added logging
                                return reject(error);
                            }
                            resolve(uploadResult);
                        }).end(buffer);
                    });

                    images.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                } catch (cloudinaryError) {
                    // Catch errors specifically from Cloudinary upload
                    console.error("Caught Cloudinary upload error:", cloudinaryError);
                    return NextResponse.json({ success: false, message: `Cloudinary upload failed: ${cloudinaryError.message}` }, { status: 500 });
                }
            }
        }

        if (images.length === 0) {
            return NextResponse.json({ success: false, message: 'No images uploaded' }, { status: 400 });
        }

        return NextResponse.json({ success: true, images }, { status: 200 });

    } catch (error) {
        console.error("General Error in /api/upload:", error); // Renamed logging for clarity
        return NextResponse.json({ success: false, message: error.message || 'Image upload failed' }, { status: 500 });
    }
}