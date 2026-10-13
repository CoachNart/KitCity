import 'server-only';

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initializeFirebaseAdmin() {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    let serviceAccount: Record<string, unknown>;
    try {
      serviceAccount = JSON.parse(serviceAccountJson) as Record<string, unknown>;
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON.');
    }

    if (
      typeof serviceAccount.project_id !== 'string' ||
      typeof serviceAccount.client_email !== 'string' ||
      typeof serviceAccount.private_key !== 'string'
    ) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON must include project_id, client_email, and private_key.',
      );
    }

    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
      }),
      projectId: serviceAccount.project_id,
    });
  }

  // Supports Google Application Default Credentials in environments that provide them.
  return initializeApp({ credential: applicationDefault() });
}

const app = initializeFirebaseAdmin();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
