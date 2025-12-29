import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Slide from '@/models/slideModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const DELETE = handleAsyncError(async (request, { params }) => {
  await db();
  const { id } = params; // Get the ID from the URL parameter

  const slide = await Slide.findById(id);

  if (!slide) {
    return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
  }

  await slide.deleteOne(); // Use deleteOne() instead of remove()

  return NextResponse.json({ success: true, message: 'Slide deleted successfully' }, { status: 200 });
});
