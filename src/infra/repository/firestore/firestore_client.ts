import * as firebase from "firebase";

export const createFirestoreClient = (): firebase.firestore.Firestore => {
  const client = firebase.firestore();
  if (
    process.env.VUE_APP_FIREBASE_FIRESTORE_USE_REAL !== "true" &&
    location.hostname === "localhost"
  ) {
    client.settings({
      host: `localhost:${process.env.VUE_APP_FIREBASE_FIRESTORE_EMULATOR_PORT}`,
      ssl: false,
    });
  }
  return client;
};
