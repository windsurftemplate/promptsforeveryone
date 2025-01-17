import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file || !filename) {
      return NextResponse.json(
        { error: 'File and filename are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    const adsDir = join(publicDir, 'images', 'ads');
    await writeFile(join(adsDir, filename), buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 