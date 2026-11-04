import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const productId = (formData.get('productId') as string) || 'misc';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const isVideo = file.type.startsWith('video');

      // Upload to Cloudinary as a base64 data URI
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: `dofit/products/${productId}`,
        resource_type: isVideo ? 'video' : 'image',
        // Auto quality + format optimisation (free tier)
        quality: 'auto',
        fetch_format: 'auto',
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Upload failed. Please check Cloudinary configuration.' },
      { status: 500 }
    );
  }
}
