import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin'; 
// GET: Fetch all categories
export async function GET() {
  try {
    const snapshot = await adminDb.collection('categories').get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const docRef = await adminDb.collection('categories').add({ name });

    return NextResponse.json({ id: docRef.id, name }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
