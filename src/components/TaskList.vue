<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import { Task } from "@/domain/entity";

type Props = {
  tasks: Task[];
};

const TaskList = defineComponent({
  name: "TaskList",
  props: {
    tasks: Object,
  },
  setup(props: Props) {
    return {
      tasks: props.tasks,
    };
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
