import { NextResponse } from 'next/server';
import db from '@/lib/db';
import PaymentSettings from '@/models/paymentSettingsModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json();
  const { taxPercentage, insideDhakaShippingCost, outsideDhakaShippingCost } = body;

  let settings = await PaymentSettings.findOne();

  if (settings) {
    // Update existing settings
    settings.taxPercentage = taxPercentage;
    settings.insideDhakaShippingCost = insideDhakaShippingCost;
    settings.outsideDhakaShippingCost = outsideDhakaShippingCost;
    await settings.save();
  } else {
    // Create new settings
    settings = await PaymentSettings.create({
      taxPercentage,
      insideDhakaShippingCost,
      outsideDhakaShippingCost,
    });
  }



  return NextResponse.json({ success: true, settings }, { status: 200 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const settings = await PaymentSettings.findOne();

  return NextResponse.json(settings || {});
});
