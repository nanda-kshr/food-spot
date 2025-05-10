import { NextRequest, NextResponse } from 'next/server';
import { adminDB, adminAuth } from '@/utils/firebaseAdmin';

// Middleware to verify partner role and get UID (used for POST, PUT, DELETE)
async function verifyPartner(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token');
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const uid = decodedToken.uid;

  const roleRef = adminDB.collection('partners').doc(uid);
  const roleDoc = await roleRef.get();

  if (!roleDoc.exists || roleDoc.data()?.role !== 'partner') {
    throw new Error('Unauthorized: User is not a partner');
  }

  return uid;
}

// GET: Fetch items for a specific partner (public access)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 });
    }

    const itemsCollection = adminDB.collection('items');
    const snapshot = await itemsCollection.where('partnerId', '==', partnerId).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ items }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST: Create a new item for the authenticated partner
export async function POST(req: NextRequest) {
  try {
    const partnerId = await verifyPartner(req);

    const body = await req.json();
    const { name, price, description, category, image, mustTry = false } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const itemsCollection = adminDB.collection('items');
    const itemRef = await itemsCollection.add({ name, price, description, category, image, mustTry, partnerId });

    return NextResponse.json({ id: itemRef.id, name, price, description, category, image, mustTry, partnerId }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
    const status = errorMessage.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

// PUT: Update an item for the authenticated partner
export async function PUT(req: NextRequest) {
  try {
    const partnerId = await verifyPartner(req);

    const body = await req.json();
    const { id, name, price, description, category, image, mustTry } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    // Verify the item belongs to the partner
    const itemRef = adminDB.collection('items').doc(id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists || itemDoc.data()?.partnerId !== partnerId) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 403 });
    }

    await itemRef.update({ name, price, description, category, image, mustTry });

    return NextResponse.json({ id, name, price, description, category, image, mustTry, partnerId }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
    const status = errorMessage.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

// DELETE: Delete an item for the authenticated partner
export async function DELETE(req: NextRequest) {
  try {
    const partnerId = await verifyPartner(req);

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    // Verify the item belongs to the partner
    const itemRef = adminDB.collection('items').doc(id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists || itemDoc.data()?.partnerId !== partnerId) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 403 });
    }

    await itemRef.delete();

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
    const status = errorMessage.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}