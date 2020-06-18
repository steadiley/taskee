<template>
  <UiRow>
    {{ task }}
    <UiCol>
      <UiCard>
        <UiCheckbox
          v-model="myCheckBoxModel"
          :index="task.id"
          :input-value="task.id"
          :color="checkOptions.color"
          @input="toggleCheck"
        />
        <div>{{ task.title }}</div>
        <div>Total: {{ totalTimeSpent }} minutes</div>
        <button @click="toggleTimer(isRunning)">
          {{ isRunning ? "STOP" : "START" }}
        </button>
      </UiCard>
    </UiCol>
  </UiRow>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "@vue/composition-api";
import { Task } from "../domain/entity";
import { useTaskStore } from "../composables/use_store";
import UiCard from "@/components/ui/Card.vue";
import UiRow from "@/components/ui/Row.vue";
import UiCol from "@/components/ui/Col.vue";
import UiCheckbox from "@/components/ui/Checkbox.vue";

interface Props {
  task: Task;
  runningTask: { task: Task; startedAt: Date };
  finishTask: { task: Task };
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

export const useCheck = (taskId: string) => {
  const taskStore = useTaskStore();
  const toggleCheck = async (isChecked: string) => {
    if (isChecked && isChecked.length > 0) {
      await taskStore.finishedTask(taskId);
    } else {
      await taskStore.returnTask(taskId);
    }
  };
  return {
    toggleCheck,
  };
};

const TaskCard = defineComponent({
  name: "TaskCard",
  components: {
    UiCard,
    UiRow,
    UiCol,
    UiCheckbox,
  },
  props: {
    task: Object,
    runningTask: Object,
    finishTask: Object,
  },
  setup(props: Props) {
    const checkOptions = {
      color: "red",
    };
    const taskStore = useTaskStore();
    // const myCheckBoxModel = reactive([]);
    const myCheckBoxModel = reactive([]);
    const { toggleTimer } = useTimer(props.task.id);
    const isRunning = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
    const totalTimeSpent = computed(() => {
      const totalMillisec = taskStore.calcTotalTimeSpentById(props.task.id);
      return Math.floor(totalMillisec / (60 * 1000));
    });

    const { toggleCheck } = useCheck(props.task.id);
    const isChecked = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
    // const toggleCheck = async (isChecked: string) => {
    //   if (isChecked && isChecked.length > 0) {
    //     await taskStore.finishedTask(props.task.id);
    //     if (!props.task.finishedAt) {
    //       await myCheckBoxModel.splice(0);
    //     }
    //   } else {
    //     await taskStore.returnTask(props.task.id);
    //   }
    // };
    return {
      toggleTimer,
      isRunning,
      totalTimeSpent,
      checkOptions,
      myCheckBoxModel,
      toggleCheck,
      isChecked,
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
