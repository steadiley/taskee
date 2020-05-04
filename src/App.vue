<template>
  <div id="app">
    <UiContainer mode="dark">
      <div id="nav">
        <router-link to="/">Home</router-link>
      </div>
      <router-view />
    </UiContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";

import { provideStore, useTaskStore } from "./composables/use_store";

import UiContainer from "@/components/ui/Container.vue";

const App = defineComponent({
  name: "App",
  components: {
    UiContainer,
  },
  setup(_, { root: { $store } }) {
    provideStore($store);

    const taskStore = useTaskStore();
    onMounted(async () => {
      await Promise.all([
        taskStore.fetchTodaysTasks(),
        taskStore.fetchTaskEvents(),
      ]);
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
