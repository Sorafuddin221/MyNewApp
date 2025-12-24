import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image'); // 'image' is the field name from the frontend

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
      folder: 'EasyShopApp', // Optional: folder in Cloudinary to organize uploads
      resource_type: 'image' // Ensure it's treated as an image
    });

    const imageUrl = result.secure_url;
    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
  }
}
