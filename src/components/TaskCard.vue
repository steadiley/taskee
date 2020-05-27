<template>
  <UiRow>
    <UiCol>
      <UiCard>
        <UiCheckbox
          v-model="myCheckBoxModel"
          @change="toggleCheck(isChecked)"
          :index="task.id"
          :input-value="task.id"
          :color="checkOptions.color"
        />
        <div>{{ task }}</div>
        <div>{{ myCheckBoxModel }}</div>
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
}

// タイマーロジックの分離
export const useTimer = (taskId: string) => {
  // VuexのTaskStoreのClassを変数に代入
  const taskStore = useTaskStore();
  const toggleTimer = async (isRunning: boolean) => {
    if (isRunning) {
      await taskStore.stopRunningTask();
    } else {
      await taskStore.startTask(taskId);
    }
  };
  console.log(toggleTimer);
  return {
    toggleTimer,
  };
};

// export const useCheck = (taskId: string) => {
//   const taskStore = useTaskStore();
//   const toggleCheck = async (isChecked: boolean) => {
//     if (isChecked) {
//       await myCheckBoxModel.push(taskId);
//     } else {
//       await myCheckBoxModel.filter(item => item !== taskId);
//     }
//   };
// };

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
  },
  setup(props: Props) {
    const checkOptions = [
      {
        color: "red",
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
