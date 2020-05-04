<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <div v-if="isLoggedIn">
        <div>Signed in as {{ email }}</div>
        <button @click="logout">Logout</button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import { defineComponent, computed } from "@vue/composition-api";

import {
  provideStore,
  useUserStore,
  useTaskStore,
} from "./composables/use_store";
import { initializeFirebaseAuth } from "@/lib/firebase";

const App = defineComponent({
  name: "App",
  setup(_, { root: { $store } }) {
    provideStore($store);

    const userStore = useUserStore();
    const taskStore = useTaskStore();
    initializeFirebaseAuth(userStore, taskStore);
    const email = computed(() => userStore.email);
    const isLoggedIn = computed(() => userStore.isLoggedIn);

    const logout = async () => {
      await firebase.auth().signOut();
      userStore.logout();
    };

    return {
      email,
      isLoggedIn,
      logout,
    };
  },
});
export default App;
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
