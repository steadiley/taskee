<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";

import firebase from "firebase";
import * as firebaseui from "firebaseui";

export default defineComponent({
  name: "Auth",
  setup() {
    onMounted(() => {
      const uiConfig = {
        signInSuccessUrl: "/",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      };
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", uiConfig);
    });
  },
});
</script>
