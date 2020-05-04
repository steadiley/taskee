import * as firebase from "firebase";
import "firebase/firestore";

import router from "@/router";
import { UserStore } from "@/store/user";
import { TaskStore } from "@/store/task";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

export const initializeFirebaseAuth = (
  userStore: UserStore,
  taskStore: TaskStore
) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      userStore.login({ userId: user.uid, email: user.email });
      await taskStore.fetchInitData();

      router.push("/").catch(() => {
        /* ignoring duplicate navigation error*/
      });
    } else {
      router.push("/auth").catch(() => {
        /* ignoring duplicate navigation error*/
      });
    }
  });
};
