<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <TaskCard :task="task" :runningTask="runningTask" />
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
    runningTask: Object,
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
