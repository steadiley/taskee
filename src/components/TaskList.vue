<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";

import { getModule } from "vuex-module-decorators";
import { TaskStore } from "../store/task";

const TaskList = defineComponent({
  name: "TaskList",
  setup(_, { root }) {
    const taskStore = getModule(TaskStore, root.$store);
    onMounted(async () => {
      await taskStore.fetchBacklogTasks();
    });
    return {
      tasks: taskStore.tasks,
    };
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
