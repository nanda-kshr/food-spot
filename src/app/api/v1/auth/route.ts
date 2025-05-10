import { NextRequest, NextResponse } from 'next/server';
import { adminDB, adminAuth } from '@/utils/firebaseAdmin';

// GET: Fetch user role based on UID from auth token
export async function GET(req: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check roles collection for user's role
    const roleRef = adminDB.collection('roles').doc(uid);
    const roleDoc = await roleRef.get();

    if (roleDoc.exists()) {
      const { role } = roleDoc.data();
      if (role === 'admin') {
        return NextResponse.json({ role: 'admin' }, { status: 200 });
      } else if (role === 'partner') {
        return NextResponse.json({ role: 'partner' }, { status: 200 });
      }
    }

    // Default to customer if no role or role is not admin/partner
    return NextResponse.json({ role: 'customer' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify role' }, { status: 500 });
  }
}