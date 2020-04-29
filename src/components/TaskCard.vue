<template>
  <div class="task">
    <div>{{ task.title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const TaskCard = defineComponent({
  name: "TaskCard",
  props: {
    task: Object,
  },
});
export default TaskCard;
</script>

<style scoped lang="scss">
.task {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
