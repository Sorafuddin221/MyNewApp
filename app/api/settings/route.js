import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Settings from '@/models/settingsModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';

// Get settings
export const GET = handleAsyncError(async () => {
  await db(); // Call the connectMongoDatabase function directly
  const settings = await Settings.findOne({});
  // No explicit disconnect needed here as connection is cached
  return NextResponse.json(settings);
});

// Update settings
export const POST = handleAsyncError(async (req) => {
  const { user, isAuthenticated } = await verifyUserAuth(req);
  if (!isAuthenticated || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { siteTitle, siteLogoUrl, siteFaviconUrl, textIcon } = body;

  await db(); // Call the connectMongoDatabase function directly
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings({
      siteTitle,
      siteLogoUrl,
      siteFaviconUrl,
      textIcon,
    });
  } else {
    settings.siteTitle = siteTitle;
    settings.siteLogoUrl = siteLogoUrl;
    settings.siteFaviconUrl = siteFaviconUrl;
    settings.textIcon = textIcon;
  }

  await settings.save();
  // No explicit disconnect needed here as connection is cached
  return NextResponse.json({ message: 'Settings updated successfully', settings });
});
