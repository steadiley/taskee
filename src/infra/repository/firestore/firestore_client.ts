import firebase from "firebase";

const firestore = firebase.firestore();
if (
  process.env.VUE_APP_FIREBASE_FIRESTORE_USE_REAL !== "true" &&
  location.hostname === "localhost"
) {
  firestore.settings({
    host: `localhost:${process.env.VUE_APP_FIREBASE_FIRESTORE_EMULATOR_PORT}`,
    ssl: false,
  });
}

export default firestore;
