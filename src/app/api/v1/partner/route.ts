import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';

// GET: Fetch all partners
export async function GET() {
  try {
    const snapshot = await adminDb.collection('partners').get();
    const partners = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ partners }, { status: 200 });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST: Create a new partner and assign role
export async function POST(req: NextRequest) {
  try {
    const { name, email, uid } = await req.json();

    if (!name || !email || !uid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add partner to partners collection
    const partnerRef = await adminDb.collection('partners').add({ name, email, uid });

    // Assign partner role in roles collection
    await adminDb.collection('roles').doc(uid).set({ role: 'partner' }, { merge: true });

    return NextResponse.json({ id: partnerRef.id, name, email, uid }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

// DELETE: Delete a partner and their role
export async function DELETE(req: NextRequest) {
  try {
    const { id, uid } = await req.json();

    if (!id || !uid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Delete partner document
    await adminDb.collection('partners').doc(id).delete();

    // Delete role document
    await adminDb.collection('roles').doc(uid).delete();

    return NextResponse.json({ message: 'Partner deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
