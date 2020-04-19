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

const TaskList = defineComponent({
  name: "TaskList",
  setup() {
    const taskUsecase = inject<TaskUsecase>("taskUsecase");
    assertIsDefined(taskUsecase);

    const tasks = ref<Task[]>([]);

    onMounted(async () => {
      tasks.value = await taskUsecase.listBacklogTasks();
    });

    return {
      tasks,
    };
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
