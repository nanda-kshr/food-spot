import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};