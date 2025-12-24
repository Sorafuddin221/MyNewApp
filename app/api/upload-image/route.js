import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image'); // 'image' is the field name from the frontend

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '-' + file.name;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
  }
}
