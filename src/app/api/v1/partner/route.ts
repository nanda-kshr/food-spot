import { NextRequest, NextResponse } from 'next/server';
import { adminDB, adminAuth } from '@/utils/firebaseAdmin';

// GET: Fetch all partners
export async function GET() {
  try {
    const partnersCollection = adminDB.collection('partners');
    const snapshot = await partnersCollection.get();
    const partners = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ partners }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST: Create a new partner and assign role
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, phone, shop_name, location } = body;
    const role = 'partner';
    // Step 1: Create Auth User
    const userRecord = await adminAuth.createUser({ email, password });

    // Step 2: Set Custom Claims (role)
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // Step 3: Store extra fields in Firestore
    await adminDB.collection('partners').doc(userRecord.uid).set({
      phone,
      shop_name,
      location,
      email,
      role,
      createdAt: new Date(),
    });

    return NextResponse.json({ uid: userRecord.uid, message: 'Partner created successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

// DELETE: Delete a partner and their role
export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const id = uid;

    // Delete partner from partners collection
    const partnerRef = adminDB.collection('partners').doc(id);
    await partnerRef.delete();

    // Delete role from roles collection
    const roleRef = adminDB.collection('partners').doc(uid);
    await roleRef.delete();

    return NextResponse.json({ message: 'Partner deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}