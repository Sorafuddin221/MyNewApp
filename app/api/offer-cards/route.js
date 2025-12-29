import { NextResponse } from 'next/server';
import db from '@/lib/db';
import OfferCard from '@/models/offerCardModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json();
  const { imageUrl, title, description, buttonUrl, displayLocation } = body;

  if (!imageUrl || !title || !description) {
    return NextResponse.json({ success: false, message: 'Image URL, Title, and Description are required' }, { status: 400 });
  }

  const newOfferCard = new OfferCard({
    imageUrl,
    title,
    description,
    buttonUrl,
    displayLocation,
  });

  await newOfferCard.save();


  return NextResponse.json({ success: true, offerCard: newOfferCard }, { status: 201 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const offerCards = await OfferCard.find({});

  return NextResponse.json(offerCards);
});
