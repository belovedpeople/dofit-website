import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * GET /api/upload
 * Generates a cryptographic signature so the client browser can upload
 * large camera photos and video files (10MB–100MB) DIRECTLY to Cloudinary.
 * This completely bypasses Vercel's 4.5MB serverless request body limit!
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || 'misc';
    const folder = `dofit/products/${productId}`;
    const timestamp = Math.round(Date.now() / 1000);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: 'Cloudinary environment variables not configured on server' },
        { status: 500 }
      );
    }

    // Cloudinary signature signs parameters in alphabetical order
    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    console.error('Error generating Cloudinary upload signature:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/upload
 * Fallback server-side upload for smaller files or environments where
 * client-direct uploads might be restricted by local firewalls.
 */
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
      const isVideo = Boolean(
        file.type?.startsWith('video') ||
        /\.(mp4|mov|webm|avi|m4v|3gp)$/i.test(file.name)
      );
      const mime = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

      // Upload to Cloudinary as a base64 data URI
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: `dofit/products/${productId}`,
        resource_type: isVideo ? 'video' : 'image',
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
