import { NextResponse } from 'next/server';
import db from '@/lib/db';
import OfferCard from '@/models/offerCardModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const DELETE = handleAsyncError(async (request, context) => {
  await db();
  const { id } = await context.params; // Await the params object

  const offerCard = await OfferCard.findById(id);

  if (!offerCard) {
    return NextResponse.json({ success: false, message: 'Offer Card not found' }, { status: 404 });
  }

  await offerCard.deleteOne(); // Use deleteOne()

  return NextResponse.json({ success: true, message: 'Offer Card deleted successfully' }, { status: 200 });
});
