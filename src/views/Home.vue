<template>
  <div class="home">
    <TaskList :tasks="tasks" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

import TaskList from "@/components/TaskList.vue";
import { useTaskStore } from "@/composables/use_store";

const Home = defineComponent({
  name: "TaskList",
  components: {
    TaskList,
  },
  setup() {
    const taskStore = useTaskStore();
    const tasks = computed(() => taskStore.tasks);
    return {
      tasks,
    };
  },
});
export default Home;
</script>
