<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <TaskCard :task="task" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import TaskCard from "@/components/TaskCard.vue";

const TaskList = defineComponent({
  name: "TaskList",
  components: {
    TaskCard,
  },
  props: {
    tasks: Array,
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
