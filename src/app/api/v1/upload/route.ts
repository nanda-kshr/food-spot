import { NextRequest, NextResponse } from 'next/server';
import { adminStorage, adminAuth } from '@/utils/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

// Current system information from the provided values
const CURRENT_DATE_TIME = "2025-05-10 19:53:07";
const CURRENT_USER = "nanda-kshr";

// Cache duration for uploaded images (2 days in seconds)
const CACHE_DURATION = 60 * 60 * 24 * 2; // 2 days

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(`[${CURRENT_DATE_TIME}] Unauthorized access attempt by ${CURRENT_USER}`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error(`[${CURRENT_DATE_TIME}] Token verification failed for user: ${CURRENT_USER}`, error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      console.error(`[${CURRENT_DATE_TIME}] No image file provided by user: ${CURRENT_USER}`);
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(imageFile.type)) {
      console.error(`[${CURRENT_DATE_TIME}] Invalid file type (${imageFile.type}) uploaded by user: ${CURRENT_USER}`);
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, 
        { status: 400 }
      );
    }

    // Validate file size (limit to 500KB)
    const maxSize = 500 * 1024; // 500KB
    if (imageFile.size > maxSize) {
      console.error(`[${CURRENT_DATE_TIME}] File size (${imageFile.size} bytes) exceeds limit, uploaded by user: ${CURRENT_USER}`);
      return NextResponse.json(
        { message: 'File size exceeds the 500KB limit.' }, 
        { status: 400 }
      );
    }

    // Get reference to the storage bucket
    const bucket = adminStorage.bucket();

    // Generate a unique filename and organize by date
    const fileExtension = imageFile.name.split('.').pop();
    const today = CURRENT_DATE_TIME.split(' ')[0].replace(/-/g, ''); // Extract YYYYMMDD from the datetime
    const uniqueFilename = `items/${today}/${uuidv4()}.${fileExtension}`;

    // Convert the file to buffer
    const buffer = await imageFile.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Create a file reference
    const fileRef = bucket.file(uniqueFilename);

    // Log the upload attempt
    console.log(`[${CURRENT_DATE_TIME}] User ${CURRENT_USER} is uploading file: ${uniqueFilename}, size: ${imageFile.size} bytes`);

    // Set metadata with cache control
    const metadata = {
      contentType: imageFile.type,
      cacheControl: `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
      metadata: {
        uploadedBy: CURRENT_USER,
        uploadedAt: CURRENT_DATE_TIME,
        firebaseStorageDownloadTokens: uuidv4() // This ensures the URL will work with authentication
      }
    };

    // Upload the file with metadata
    await fileRef.save(fileBuffer, {
      metadata: metadata
    });

    // Make the file publicly accessible
    await fileRef.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
    console.log(`[${CURRENT_DATE_TIME}] Upload successful for user ${CURRENT_USER}: ${publicUrl}`);

    // Return success response with the image URL and strong caching headers
    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl: publicUrl 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, immutable`,
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error(`[${CURRENT_DATE_TIME}] Upload error for user ${CURRENT_USER}:`, error);
    return NextResponse.json(
      { message: 'Error uploading image' }, 
      { status: 500 }
    );
  }
}