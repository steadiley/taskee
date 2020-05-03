<template>
  <div class="task">
    <div>{{ task.title }}</div>
    <button @click="toggleTimer(isRunning)">
      {{ isRunning ? "STOP" : "START" }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { Task } from "../domain/entity";
import { useTaskStore } from "../composables/use_store";

interface Props {
  task: Task;
  runningTask: Task;
}

export const useTimer = (taskId: string) => {
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
    runningTask: Object,
  },
  setup(props: Props) {
    const { toggleTimer } = useTimer(props.task.id);
    const isRunning = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.id;
    });
    return {
      toggleTimer,
      isRunning,
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
