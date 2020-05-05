<template>
  <UiCard>
    <div>{{ task.title }}</div>
    <div>Total: {{ totalTimeSpent }} minutes</div>
    <button @click="toggleTimer(isRunning)">
      {{ isRunning ? "STOP" : "START" }}
    </button>
  </UiCard>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { Task } from "../domain/entity";
import { useTaskStore } from "../composables/use_store";
import UiCard from "@/components/ui/Card.vue";

interface Props {
  task: Task;
  runningTask: { task: Task; startedAt: Date };
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
  components: {
    UiCard,
  },
  props: {
    task: Object,
    runningTask: Object,
  },
  setup(props: Props) {
    const { toggleTimer } = useTimer(props.task.id);
    const isRunning = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
    const taskStore = useTaskStore();
    const totalTimeSpent = computed(() => {
      const totalMillisec = taskStore.calcTotalTimeSpentById(props.task.id);
      return Math.floor(totalMillisec / (60 * 1000));
    });
    return {
      toggleTimer,
      isRunning,
      totalTimeSpent,
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
