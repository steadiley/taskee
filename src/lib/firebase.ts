import firebase from "firebase";
import "firebase/firestore";

// TODO: to be fixed via environment variables
firebase.initializeApp({
  apiKey: "### FIREBASE API KEY ###",
  authDomain: "### FIREBASE AUTH DOMAIN ###",
  projectId: "### CLOUD FIRESTORE PROJECT ID ###",
});
