import { NextResponse } from 'next/server';
import db from '@/lib/db';
import SpecialOffer from '@/models/specialOfferModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const DELETE = handleAsyncError(async (request, { params }) => {
  await db();
  const { id } = params; // Get the ID from the URL parameter

  const specialOffer = await SpecialOffer.findById(id);

  if (!specialOffer) {
    return NextResponse.json({ success: false, message: 'Special Offer not found' }, { status: 404 });
  }

  await specialOffer.deleteOne(); // Use deleteOne()

  return NextResponse.json({ success: true, message: 'Special Offer deleted successfully' }, { status: 200 });
});
