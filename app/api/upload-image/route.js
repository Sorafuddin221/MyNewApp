// app/api/upload-image/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import handleAsyncError from '@/middleware/handleAsyncError';

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

export const POST = handleAsyncError(async (request) => {
  const formData = await request.formData();
  const file = formData.get('image');

  if (!file) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, 'easyshop');
  
  return NextResponse.json({ imageUrl: result.secure_url });
});
