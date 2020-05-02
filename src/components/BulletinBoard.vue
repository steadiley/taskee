<template>
  <div>Current task is "{{ runningTask.title }}"</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const TaskList = defineComponent({
  name: "TaskList",
  props: {
    runningTask: Object,
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
