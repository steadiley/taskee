<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const TaskList = defineComponent({
  name: "TaskList",
  props: {
    tasks: Array,
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
