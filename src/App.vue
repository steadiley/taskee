<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";

import { provideStore, useTaskStore } from "./composables/use_store";

const App = defineComponent({
  name: "TaskList",
  setup(_, { root: { $store } }) {
    provideStore($store);

    const taskStore = useTaskStore();
    onMounted(async () => {
      await taskStore.fetchBacklogTasks();
    });
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
