import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin'; // ← your admin Firestore instance

// GET: Fetch all items
export async function GET() {
  try {
    const snapshot = await adminDb.collection('items').get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST: Create a new item
export async function POST(req: NextRequest) {
  try {
    const { name, price, description, category, image } = await req.json();

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await adminDb.collection('items').add({ name, price, description, category, image });

    return NextResponse.json({ id: docRef.id, name, price, description, category, image }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

// PUT: Update an item
export async function PUT(req: NextRequest) {
  try {
    const { id, name, price, description, category, image } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    const itemRef = adminDb.collection('items').doc(id);
    await itemRef.update({ name, price, description, category, image });

    return NextResponse.json({ id, name, price, description, category, image }, { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE: Delete an item
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    const itemRef = adminDb.collection('items').doc(id);
    await itemRef.delete();

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
