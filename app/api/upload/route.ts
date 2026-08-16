import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max for video uploads

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  console.log('>>> API UPLOAD: Request received');
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary credentials missing');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Cloudinary credentials not configured'
      }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('>>> API UPLOAD: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Better video detection for size limits
    const isVideoFile = file.type.startsWith('video/') || 
                       /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(file.name);

    // Check file size (max 100MB for videos, 10MB for images)
    const maxSize = isVideoFile ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Plik jest za duży. Maksymalny rozmiar dla ${isVideoFile ? 'filmów to 100MB' : 'zdjęć to 10MB'}` 
      }, { status: 400 });
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type || 'unknown',
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      detectedAsVideo: isVideoFile
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`>>> Starting Cloudinary upload for ${file.name} (${buffer.length} bytes)`);

    // Detect if it's a video by type or extension
    const isVideo = file.type.startsWith('video/') || 
                    /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(file.name);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: 'szoniska',
        resource_type: isVideo ? 'video' : 'auto',
      };

      if (isVideo) {
        uploadOptions.chunk_size = 6000000;
        uploadOptions.eager_async = true;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('!!! Cloudinary Error:', error);
            reject(error);
          } else {
            console.log('+++ Cloudinary Success:', result?.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
