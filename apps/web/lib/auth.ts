import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getIdTokenResult,
} from "firebase/auth";
import { firebaseAuth } from "./firebaseClient";

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function destination(claims: any): string {
  return claims && claims.companyId ? "/dashboard" : "/onboarding";
}

export async function signin(email: string, password: string): Promise<string> {
  const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const token = await getIdTokenResult(cred.user);
  return destination(token.claims);
}

export async function signup(email: string, password: string): Promise<string> {
  const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const token = await getIdTokenResult(cred.user);
  return destination(token.claims);
}

export async function googlePopup(): Promise<string> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(firebaseAuth, provider);
  const token = await getIdTokenResult(cred.user);
  return destination(token.claims);
}

export function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(firebaseAuth, email);
}

export function friendlyError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password";
    default:
      return "Something went wrong. Please try again.";
  }
}
