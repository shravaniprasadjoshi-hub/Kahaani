import admin from 'firebase-admin';

// Initialize the Admin SDK only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // This handles the newline characters in the private key from your .env
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// These exports are what your backend routes (like artist.js) are looking for
export { db, auth, storage, admin };