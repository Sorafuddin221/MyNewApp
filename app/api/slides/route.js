import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Slide from '@/models/slideModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json(); // Use request.json()
  console.log('Received body for new slide:', body); // Debug log
  const { imageUrl, buttonUrl } = body;

  if (!imageUrl) {
    console.log('Image URL is missing.'); // Debug log
    return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
  }

  const newSlide = new Slide({
    imageUrl,
    buttonUrl,
  });

  console.log('New slide object before saving:', newSlide); // Debug log
  await newSlide.save();
  console.log('Slide saved successfully!'); // Debug log
  // db.disconnect() is not typically called here in Next.js API routes due to connection caching
  // and potential for multiple requests using the same connection within a short period.

  return NextResponse.json({ success: true, slide: newSlide }, { status: 201 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const slides = await Slide.find({});
  // db.disconnect() is not typically called here
  return NextResponse.json(slides);
});