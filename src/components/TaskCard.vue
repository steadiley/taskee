<template>
  <div class="task">
    <div>{{ task.title }}</div>
    <button @click="toggleTimer(isRunning)">
      {{ isRunning ? "STOP" : "START" }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Task, TaskEvent } from "../domain/entity";
import { useTaskStore } from "../composables/use_store";

interface Props {
  task: Task;
  events: TaskEvent[];
  isRunning: boolean;
}

const useTimer = (taskId: string) => {
  const taskStore = useTaskStore();
  const toggleTimer = async (isRunning: boolean) => {
    if (isRunning) {
      await taskStore.stopRunningTask();
    } else {
      await taskStore.startTask(taskId);
    }
  };
  return {
    toggleTimer,
  };
};

const TaskCard = defineComponent({
  name: "TaskCard",
  props: {
    task: Object,
    events: Object,
    isRunning: Boolean,
  },
  setup({ task }: Props) {
    const { toggleTimer } = useTimer(task.id);
    return {
      toggleTimer,
    };
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
