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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  const code = (error as { code?: string })?.code || '';
  const errStr = error instanceof Error ? error.message : String(error);
  const combined = `${code} ${errStr}`.toLowerCase();

  if (combined.includes('requests-from-referer') || combined.includes('unauthorized-domain')) {
    return 'Domain/Referer restriction: This preview domain is not in the authorized HTTP referrers list.';
  }
  if (combined.includes('api-key-not-valid') || combined.includes('app-not-authorized')) {
    return 'Authentication provider authorization issue. Please verify your project credentials.';
  }
  if (combined.includes('auth/invalid-credential') || combined.includes('auth/wrong-password')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (combined.includes('auth/user-not-found')) {
    return 'No account exists with this email address.';
  }
  if (combined.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Try signing in.';
  }
  if (combined.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters with mixed letters and numbers.';
  }
  if (combined.includes('auth/invalid-email')) {
    return 'Please provide a valid email address.';
  }
  if (combined.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in provider is not enabled in the Firebase Console.';
  }
  if (combined.includes('auth/too-many-requests')) {
    return 'Access temporarily blocked due to multiple failed attempts. Please reset your password or try again later.';
  }
  if (combined.includes('auth/requires-recent-login')) {
    return 'This operation is sensitive and requires recent authentication. Please sign out and sign back in before updating your password.';
  }
  if (combined.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  const cleaned = errStr
    .replace(/^Firebase:\s*/i, '')
    .replace(/\(auth\/[^)]+\)\.?$/i, '')
    .replace(/^Error:\s*/i, '')
    .trim();

  if (!cleaned || cleaned.toLowerCase() === 'error') {
    return 'Authentication request failed. Please check your credentials.';
  }

  return cleaned;
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

/**
 * Securely changes the current authenticated Firebase user's password.
 *
 * Requirements met:
 * 1. Verifies Firebase Auth is configured.
 * 2. Verifies auth.currentUser exists.
 * 3. Verifies current user has an email/password authentication provider.
 * 4. Re-authenticates current user with supplied current password.
 * 5. Updates password using Firebase updatePassword().
 * 6. Never stores or logs either password.
 * 7. Never writes passwords to Firestore, localStorage, or sessionStorage.
 * 8. Returns sanitized, user-friendly error messages on failure.
 */
export async function changeCurrentUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // 1. Verify Firebase Auth is configured
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured in this environment.');
  }

  // 2. Verify active authenticated Firebase user exists
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error('No active authenticated user session found. Please sign in again.');
  }

  // 3. Verify user has email & password provider
  const email = currentUser.email;
  if (!email) {
    throw new Error('The authenticated user account does not have an email address associated with it.');
  }

  const hasPasswordProvider = currentUser.providerData.some(
    (provider) => provider.providerId === 'password'
  );
  if (!hasPasswordProvider && currentUser.providerData.length > 0) {
    throw new Error('The current user account is not authenticated with an email/password provider.');
  }

  // Input validation
  if (!currentPassword || !currentPassword.trim()) {
    throw new Error('Current passphrase is required.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New passphrase must be at least 6 characters long.');
  }
  if (currentPassword === newPassword) {
    throw new Error('New passphrase must be different from your current passphrase.');
  }

  // 4. Re-authenticate with current credentials
  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
  } catch (reauthErr: unknown) {
    const errStr = reauthErr instanceof Error ? reauthErr.message : String(reauthErr);
    if (
      errStr.includes('auth/invalid-credential') ||
      errStr.includes('auth/wrong-password')
    ) {
      throw new Error('Current passphrase is incorrect. Please verify your current passphrase and try again.');
    }
    if (errStr.includes('auth/user-not-found')) {
      throw new Error('Administrative user account was not found in Firebase Authentication.');
    }
    if (errStr.includes('auth/too-many-requests')) {
      throw new Error('Access temporarily blocked due to multiple failed attempts. Please try again later.');
    }
    if (errStr.includes('auth/network-request-failed')) {
      throw new Error('Network connection error. Please check your internet connection.');
    }
    throw new Error(formatAuthError(reauthErr));
  }

  // 5. Update password in Firebase Authentication
  try {
    await updatePassword(currentUser, newPassword);
  } catch (updateErr: unknown) {
    const errStr = updateErr instanceof Error ? updateErr.message : String(updateErr);
    if (errStr.includes('auth/weak-password')) {
      throw new Error('New passphrase is too weak. Please use at least 6 characters with mixed letters and numbers.');
    }
    if (errStr.includes('auth/requires-recent-login')) {
      throw new Error('This operation is sensitive and requires a recent login. Please sign out and sign back in before updating your passphrase.');
    }
    if (errStr.includes('auth/too-many-requests')) {
      throw new Error('Too many requests. Please wait a few minutes before trying again.');
    }
    if (errStr.includes('auth/network-request-failed')) {
      throw new Error('Network connection error. Please check your internet connection.');
    }
    throw new Error(formatAuthError(updateErr));
  }
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
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
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

  const handleChangePassword = useCallback(
    async (currentPass: string, newPass: string) => {
      setError(null);
      try {
        await changeCurrentUserPassword(currentPass, newPass);
      } catch (e) {
        const formatted = e instanceof Error ? e.message : formatAuthError(e);
        setError(formatted);
        throw new Error(formatted);
      }
    },
    []
  );

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
    changePassword: handleChangePassword,
    signOut: handleSignOut,
  };
}

