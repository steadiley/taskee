<template>
  <div class="hello">
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "@vue/composition-api";
import { Task } from "@/domain/entity";
import { TaskUsecase } from "../app";

const HelloWorld = defineComponent({
  name: "HelloWorld",
  setup() {
    const taskUsecase = inject<TaskUsecase>("taskUsecase");
    if (!taskUsecase) {
      throw new Error("Assertion Error");
    }
    const tasks = ref<Task[]>([]);

    onMounted(async () => {
      tasks.value = await taskUsecase.listBacklogTasks();
    });

    return {
      tasks,
    };
  },
});
export default HelloWorld;
</script>

<style scoped lang="scss"></style>
