'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  initializeFirestore,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId &&
  config.messagingSenderId && config.appId
);

const app = firebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(config))
  : null;
const auth = app ? getAuth(app) : null;
const db = app ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }) : null;

export function getCurrentAuthUser(): User | null {
  return auth?.currentUser ?? null;
}

export function waitForAuthState(): Promise<User | null> {
  if (!auth) return Promise.resolve(null);
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, () => {
      unsubscribe();
      resolve(null);
    });
  });
}

function usernameKey(username: string) {
  return username.trim().toLowerCase();
}

async function createOrUpdateProfile(
  user: User,
  username: string,
  deviceId: string,
  location: { latitude: number; longitude: number; accuracy: number } | null,
) {
  if (!db) throw new Error('Firebase is not configured.');
  const profileRef = doc(db, 'users', user.uid);
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    const current = existing.data();
    await setDoc(profileRef, {
      uid: user.uid,
      email: user.email ?? '',
      username: current.username,
      usernameLower: current.usernameLower,
      deviceId,
      ...(location ? { location } : {}),
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { ...current, username: current.username as string };
  }

  const cleanUsername = username.trim();
  if (!/^[A-Za-z0-9_]{3,20}$/.test(cleanUsername)) {
    throw new Error('Choose a username with 3–20 letters, numbers, or underscores.');
  }
  const normalized = usernameKey(cleanUsername);
  const usernameRef = doc(db, 'usernames', normalized);

  await runTransaction(db, async (transaction) => {
    const reserved = await transaction.get(usernameRef);
    if (reserved.exists() && reserved.data().uid !== user.uid) {
      throw new Error('That username is already taken. Choose another one.');
    }
    if (!reserved.exists()) {
      transaction.set(usernameRef, {
        uid: user.uid,
        username: cleanUsername,
        createdAt: serverTimestamp(),
      });
    }
    transaction.set(profileRef, {
      uid: user.uid,
      email: user.email ?? '',
      username: cleanUsername,
      usernameLower: normalized,
      deviceId,
      location,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    }, { merge: true });
  });

  return {
    uid: user.uid,
    email: user.email ?? '',
    username: cleanUsername,
    usernameLower: normalized,
    deviceId,
    location,
  };
}

export async function authenticateEmailPassword(input: {
  mode: 'signin' | 'signup';
  email: string;
  password: string;
  username: string;
  deviceId: string;
  location: { latitude: number; longitude: number; accuracy: number } | null;
}) {
  if (!auth || !db) {
    throw new Error('Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* settings in Vercel, then redeploy.');
  }

  const email = input.email.trim().toLowerCase();
  let user: User;

  if (input.mode === 'signup') {
    if (!/^[A-Za-z0-9_]{3,20}$/.test(input.username.trim())) {
      throw new Error('Choose a username with 3–20 letters, numbers, or underscores.');
    }
    try {
      user = (await createUserWithEmailAndPassword(auth, email, input.password)).user;
    } catch (error) {
      throw error;
    }
    try {
      const profile = await createOrUpdateProfile(user, input.username, input.deviceId, input.location);
      return { user, profile };
    } catch (error) {
      // Keep the Auth account if Firestore is temporarily unreachable. The player can
      // sign in again later to finish profile creation once the connection recovers.
      throw error;
    }
  }

  user = (await signInWithEmailAndPassword(auth, email, input.password)).user;
  const profile = await createOrUpdateProfile(user, input.username, input.deviceId, input.location);
  return { user, profile };
}

export async function getOrCreateUserProfile(
  user: User,
  username: string,
  deviceId: string,
  location: { latitude: number; longitude: number; accuracy: number } | null,
) {
  return createOrUpdateProfile(user, username, deviceId, location);
}

export async function loadCloudProgress(uid: string): Promise<Record<string, unknown> | null> {
  if (!db) return null;
  const snapshot = await getDoc(doc(db, 'users', uid, 'gameState', 'current'));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return data.progress && typeof data.progress === 'object'
    ? data.progress as Record<string, unknown>
    : null;
}

export async function flushCloudProgress(uid: string, progress: Record<string, unknown>) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid, 'gameState', 'current'), {
    progress,
    updatedAt: serverTimestamp(),
    schemaVersion: 1,
  }, { merge: true });
}

const pending = new Map<string, ReturnType<typeof setTimeout>>();
const latest = new Map<string, Record<string, unknown>>();

export function queueCloudProgressSave(uid: string, progress: Record<string, unknown>) {
  latest.set(uid, progress);
  const previous = pending.get(uid);
  if (previous) clearTimeout(previous);
  pending.set(uid, setTimeout(() => {
    pending.delete(uid);
    const snapshot = latest.get(uid);
    if (snapshot) void flushCloudProgress(uid, snapshot).catch((error) => {
      console.warn('KitCity cloud progress sync failed; local progress remains saved.', error);
    });
  }, 900));
}

export async function signOutCurrentUser() {
  if (auth) await signOut(auth);
}
