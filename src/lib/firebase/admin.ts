let adminDb: any = null;
let adminAuth: any = null;

// Only initialize if credentials are available
const hasAdminCredentials = !!(
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY
);

if (hasAdminCredentials) {
  try {
    const { cert, getApps, initializeApp } = require("firebase-admin/app");
    const { getFirestore } = require("firebase-admin/firestore");
    const { getAuth } = require("firebase-admin/auth");

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }

    adminDb = getFirestore();
    adminAuth = getAuth();
  } catch (e) {
    console.warn("[Firebase Admin] Initialization failed:", e);
  }
} else {
  console.warn(
    "[Firebase Admin] Missing credentials. Set FIREBASE_ADMIN_PROJECT_ID, " +
    "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to enable server-side features."
  );
}

export const db = adminDb;
export const auth = adminAuth;
export const isAdminConfigured = hasAdminCredentials && !!adminDb;
