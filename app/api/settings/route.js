import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Settings from '@/models/settingsModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';
import { revalidatePath } from 'next/cache';

// Get settings
export const GET = handleAsyncError(async () => {
  console.log('API: Attempting to connect to database for settings...');
  await db(); // Call the connectMongoDatabase function directly
  console.log('API: Database connected for settings. Attempting to fetch settings...');
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
  revalidatePath('/'); // Revalidate the root path to reflect updated settings
  // No explicit disconnect needed here as connection is cached
  return NextResponse.json({ message: 'Settings updated successfully', settings });
});
