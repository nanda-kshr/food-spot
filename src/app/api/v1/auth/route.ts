import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase-admin';

// GET: Fetch user role based on UID from auth token
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const roleDoc = await adminDb.collection('roles').doc(uid).get();

    if (roleDoc.exists) {
      const { role } = roleDoc.data()!;
      if (role === 'admin' || role === 'partner') {
        return NextResponse.json({ role }, { status: 200 });
      }
    }

    return NextResponse.json({ role: 'customer' }, { status: 200 });

  } catch (error) {
    console.error('Error verifying role:', error);
    return NextResponse.json({ error: 'Failed to verify role' }, { status: 500 });
  }
}
