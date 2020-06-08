<template>
  <UiRow>
    <UiCol>
      <UiCard>
        <UiCheckbox
          v-model="myCheckBoxModel"
          :index="task.id"
          :input-value="task.id"
          :color="checkOptions.color"
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

// タイマーロジックの分離
export const useTimer = (taskId: string) => {
  // VuexのTaskStoreのClassを変数に代入
  const taskStore = useTaskStore();
  const toggleTimer = async (isRunning: boolean) => {
    if (isRunning) {
      await taskStore.stopRunningTask();
      await taskStore.finishedTask();
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
    const checkOptions = [
      {
        color: "red",
      },
    ];
    const taskStore = useTaskStore();
    const isChecked = computed(() => {
      // console.log(123);
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
    const toggleCheck = (isChecked: boolean) => {
      if (isChecked) {
        console.log("x");
      } else {
        taskStore.finishTask;
      }
    };
    const myCheckBoxModel = reactive([]);
    const { toggleTimer } = useTimer(props.task.id);
    const isRunning = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
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
