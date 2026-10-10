# KitCity Firebase setup

KitCity now uses Firebase Authentication for email/password accounts and Cloud Firestore for player profiles and game progress. Before account creation can work in production, configure the Firebase project and deploy the rules below.

## 1. Create/configure the Firebase project

1. In the Firebase Console, create or select the project for KitCity.
2. Add a **Web app** and copy its Firebase web configuration.
3. Under **Authentication → Sign-in method**, enable **Email/Password**.
4. Under **Firestore Database**, create the database in production mode.
5. In **Project settings → Your apps**, use the web app configuration values for the environment variables listed below.

The Firebase web config values are public client identifiers, not admin credentials. Never place a service-account JSON, private key, or Admin SDK credential in a `NEXT_PUBLIC_*` variable.

## 2. Configure Vercel

In the Vercel project connected to this repository, add these variables for **Production**, **Preview**, and **Development** as appropriate:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Redeploy after adding or changing variables. The example names are also in `.env.example`; do not commit real values to Git.

## 3. Deploy Firestore security rules

This repository includes `firebase.json` and `firestore.rules`. From a trusted terminal with the Firebase CLI installed and authenticated, select the correct Firebase project and deploy only the rules:

```bash
firebase login
firebase use <your-firebase-project-id>
firebase deploy --only firestore:rules
```

Review the selected project before deploying. The rules restrict profile and game-state reads/writes to the authenticated owner. Username reservation documents can be checked by signed-in users but cannot be listed or modified after creation.

## 4. Player data and privacy

- **Authentication:** email/password is handled by Firebase Authentication; passwords are not stored in Firestore or local game storage.
- **Gamer ID:** a unique 3–20 character username, case-insensitive for uniqueness.
- **Device ID:** an app-generated installation ID, not a hardware fingerprint. The profile stores the most recently used installation ID.
- **Location:** off by default. If a player explicitly opts in, the browser asks for permission and KitCity stores rounded, approximate coordinates. Denying location does not block play.
- **Progress:** mission completions, practice balances, settings, scores and game state are saved locally and synced to the signed-in player's Firestore document. Local progress remains available if the network is temporarily unavailable; the next successful sign-in merges mission completions and keeps the higher practice-balance values.

The practice wallet and balances in KitCity remain simulated game values, not real funds.

## 5. Smoke test after configuration

1. Create an account with a new email and username.
2. Complete one mission, refresh, and confirm it remains completed.
3. Sign out, sign in again, and confirm the same progress returns.
4. Sign in on another browser/device and confirm the cloud progress restores.
5. Confirm a duplicate username is rejected and location permission is never requested unless the optional checkbox is selected.
