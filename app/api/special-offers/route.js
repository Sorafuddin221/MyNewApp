import { NextResponse } from 'next/server';
import db from '@/lib/db';
import SpecialOffer from '@/models/specialOfferModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json();
  const { imageUrl, buttonUrl } = body;

  if (!imageUrl) {
    return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
  }

  const newSpecialOffer = new SpecialOffer({
    imageUrl,
    buttonUrl,
  });

  await newSpecialOffer.save();

  return NextResponse.json({ success: true, specialOffer: newSpecialOffer }, { status: 201 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const specialOffers = await SpecialOffer.find({});
  return NextResponse.json(specialOffers);
});