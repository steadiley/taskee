<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "@vue/composition-api";

import { assertIsDefined } from "@/lib/assert";
import { Task } from "@/domain/entity";
import { TaskUsecase } from "../app";

const useTaskLists = (
  taskUsecase: TaskUsecase,
  onMounted: (val: Function) => void
) => {
  const tasks = ref<Task[]>([]);

  onMounted(async () => {
    tasks.value = await taskUsecase.listBacklogTasks();
  });

  return {
    tasks,
  };
};

const TaskList = defineComponent({
  name: "TaskList",
  setup() {
    const taskUsecase = inject<TaskUsecase>("taskUsecase");
    assertIsDefined(taskUsecase);
    return useTaskLists(taskUsecase, onMounted);
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
