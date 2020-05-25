<template>
  <UiCard>
    <UiCheckbox
      v-for="(option, index) in checkOptions"
      v-model="myCheckBoxModel"
      :key="index"
      :index="index"
      :input-value="task.id"
      :label="option.label"
      :labelPosition="option.labelPosition"
      :color="option.color"
    />
    <div v-for="item in myCheckBoxModel" :key="item">{{ item }}</div>
    <div>{{ task.title }}</div>
    <div>Total: {{ totalTimeSpent }} minutes</div>
    <button @click="toggleTimer(isRunning)">
      {{ isRunning ? "STOP" : "START" }}
    </button>
  </UiCard>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "@vue/composition-api";
import { Task } from "../domain/entity";
import { useTaskStore } from "../composables/use_store";
import UiCard from "@/components/ui/Card.vue";
import UiCheckbox from "@/components/ui/Checkbox.vue";

interface Props {
  task: Task;
  runningTask: { task: Task; startedAt: Date };
}

export const useTimer = (taskId: string) => {
  const taskStore = useTaskStore();
  console.log(taskStore);
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
    UiCheckbox,
  },
  props: {
    task: Object,
    runningTask: Object,
  },
  setup(props: Props) {
    const checkOptions = [
      {
        label: "Option 1",
        value: "value of option 1",
        labelPosition: "left",
        color: "red",
      },
      {
        label: "Option 2",
        value: "value of option 2",
      },
      {
        label: "Option 3",
        value: "value of option 3",
      },
      {
        value: "value of option 4",
      },
    ];
    const myCheckBoxModel = reactive([]);
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
      checkOptions,
      myCheckBoxModel,
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
