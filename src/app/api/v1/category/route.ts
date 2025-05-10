import { NextRequest, NextResponse } from 'next/server';
import { adminDB, adminAuth } from '@/utils/firebaseAdmin';

// Middleware to verify partner role and get UID
async function verifyPartner(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token');
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const uid = decodedToken.uid;

  const roleRef = adminDB.collection('roles').doc(uid);
  const roleDoc = await roleRef.get();

  if (!roleDoc.exists || roleDoc.data()?.role !== 'partner') {
    throw new Error('Unauthorized: User is not a partner');
  }

  return uid;
}

// GET: Fetch categories for the authenticated partner
export async function GET(req: NextRequest) {
  try {
    const partnerId = await verifyPartner(req);

    const categoriesCollection = adminDB.collection('categories');
    const snapshot = await categoriesCollection.where('partnerId', '==', partnerId).get();
    const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: error.message.includes('Unauthorized') ? 401 : 500 });
  }
}

// POST: Create a new category for the authenticated partner
export async function POST(req: NextRequest) {
  try {
    const partnerId = await verifyPartner(req);

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const categoriesCollection = adminDB.collection('categories');
    const categoryRef = await categoriesCollection.add({ name, partnerId });

    return NextResponse.json({ id: categoryRef.id, name, partnerId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: error.message.includes('Unauthorized') ? 401 : 500 });
  }
}