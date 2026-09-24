import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isConfigured = false;

try {
  // Support both VITE_FB_* and standard VITE_FIREBASE_* naming conventions
  const apiKey =
    import.meta.env.VITE_FB_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId =
    import.meta.env.VITE_FB_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    const authDomain =
      import.meta.env.VITE_FB_AUTH_DOMAIN ||
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
      `${projectId}.firebaseapp.com`;
    const storageBucket =
      import.meta.env.VITE_FB_STORAGE_BUCKET ||
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      `${projectId}.appspot.com`;
    const messagingSenderId =
      import.meta.env.VITE_FB_SENDER_ID ||
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
    const appId =
      import.meta.env.VITE_FB_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID;
    const measurementId =
      import.meta.env.VITE_FB_MEASUREMENT_ID ||
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      ...(measurementId ? { measurementId } : {}),
    };

    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
  } else {
    console.info('Firebase environment variables not set. Running in UI-only mode.');
  }
} catch (error) {
  console.info('Firebase not configured. Running in UI-only mode.', error);
  app = null;
  auth = null;
  db = null;
  isConfigured = false;
}

export const isFirebaseConfigured: boolean = isConfigured;
export { app, auth, db };

// ----------------------------------------------------------------------------
// Firestore Error Handling (Structured JSON for ABAC & Zero-Trust diagnosis)
// ----------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const current = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: current?.uid,
      email: current?.email,
      emailVerified: current?.emailVerified,
      isAnonymous: current?.isAnonymous,
      tenantId: current?.tenantId,
      providerInfo:
        current?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ----------------------------------------------------------------------------
// Firebase Auth Error Formatter
// ----------------------------------------------------------------------------
export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected authentication error occurred.';
  const errStr = error instanceof Error ? error.message : String(error);

  if (errStr.includes('auth/invalid-credential') || errStr.includes('auth/wrong-password')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (errStr.includes('auth/user-not-found')) {
    return 'No account exists with this email address.';
  }
  if (errStr.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Try signing in.';
  }
  if (errStr.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters with mixed letters and numbers.';
  }
  if (errStr.includes('auth/invalid-email')) {
    return 'Please provide a valid email address.';
  }
  if (errStr.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in provider is not enabled in the Firebase Console.';
  }
  if (errStr.includes('auth/too-many-requests')) {
    return 'Access temporarily blocked due to multiple failed attempts. Please reset your password or try again later.';
  }
  if (errStr.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  return errStr.replace(/^Firebase:\s*/, '').replace(/\(auth\/[^)]+\)\.?$/, '').trim() ||
    'Authentication request failed. Please try again.';
}

// ----------------------------------------------------------------------------
// Email/Password Authentication Operations
// ----------------------------------------------------------------------------
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please add your credentials to .env');
  }
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please add your credentials to .env');
  }
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName && credential.user) {
    try {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    } catch (e) {
      console.warn('Could not update user display name:', e);
    }
  }
  return credential.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please add your credentials to .env');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

// ----------------------------------------------------------------------------
// Reactive React Hook
// ----------------------------------------------------------------------------
export interface AuthState {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<User>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(() => auth?.currentUser || null);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        setError(formatAuthError(err));
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignIn = useCallback(async (email: string, pass: string) => {
    setError(null);
    try {
      return await signInWithEmail(email, pass);
    } catch (e) {
      const formatted = formatAuthError(e);
      setError(formatted);
      throw new Error(formatted);
    }
  }, []);

  const handleSignUp = useCallback(
    async (email: string, pass: string, displayName?: string) => {
      setError(null);
      try {
        return await signUpWithEmail(email, pass, displayName);
      } catch (e) {
        const formatted = formatAuthError(e);
        setError(formatted);
        throw new Error(formatted);
      }
    },
    []
  );

  const handleResetPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await sendPasswordReset(email);
    } catch (e) {
      const formatted = formatAuthError(e);
      setError(formatted);
      throw new Error(formatted);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (e) {
      const formatted = formatAuthError(e);
      setError(formatted);
      throw new Error(formatted);
    }
  }, []);

  return {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
  };
}

