import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import serviceAccount from "../../serviceAccountKey.json"; // downloaded from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
});

export const bucket = admin.storage().bucket();
