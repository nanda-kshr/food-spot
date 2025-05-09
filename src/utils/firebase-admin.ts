// utils/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.NEXT_PRIVATE_SERVICE_ACCOUNT!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
