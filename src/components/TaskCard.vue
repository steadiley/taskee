<template>
  <UiRow>
    <UiCol>
      <div class="task-container">
        <UiCard :class="{ 'disabled-task': task.finishedAt }">
          <UiCheckbox
            v-model="checkBoxModel"
            :index="task.id"
            :input-value="task.id"
            @input="toggleCheck"
          />
          <div class="delete-button">
            <DeleteButton @click="deleteTask(task.id)" />
          </div>
          <div>{{ task.title }}</div>
          <div>Total: {{ totalTimeSpent }} minutes</div>
          <button
            @click="toggleTimer(isRunning)"
            :class="{ 'event-none': task.finishedAt }"
          >
            {{ isRunning ? "STOP" : "START" }}
          </button>
        </UiCard>
      </div>
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
import DeleteButton from "@/components/ui/DeleteButton.vue";

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
  const toggleCheck = async (id: string) => {
    if (id.length > 0) {
      await taskStore.finishTask(taskId);
    } else {
      await taskStore.unfinishTask(taskId);
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
    DeleteButton,
  },
  props: {
    task: Object,
    runningTask: Object,
    finishTask: Object,
  },
  setup(props: Props) {
    const taskStore = useTaskStore();
    const checkBoxModel = reactive([]);
    const { toggleTimer } = useTimer(props.task.id);
    const isRunning = computed(() => {
      return props.runningTask && props.task.id === props.runningTask.task.id;
    });
    const totalTimeSpent = computed(() => {
      const totalMillisec = taskStore.calcTotalTimeSpentById(props.task.id);
      return Math.floor(totalMillisec / (60 * 1000));
    });

    const { toggleCheck } = useCheck(props.task.id);

    const deleteTask = async (taskId: string): Promise<void> => {
      if (!confirm("Are you sure you want to delete this task?")) {
        return;
      }
      await taskStore.deleteTask(taskId);
    };

    return {
      toggleTimer,
      isRunning,
      totalTimeSpent,
      checkBoxModel,
      toggleCheck,
      deleteTask,
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

.disabled-task {
  border: 1px solid $green;
  color: $green;
  opacity: 0.5;
}

.event-none {
  pointer-events: none;
}

.task-container {
  position: relative;
  margin: 0 10px;
}

.delete-button {
  position: absolute;
  right: -3px;
  top: -5px;
}
</style>
