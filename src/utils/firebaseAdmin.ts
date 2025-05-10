// utils/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.NEXT_PRIVATE_SERVICE_ACCOUNT!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PRIVATE_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
export const adminStorage = admin.storage();