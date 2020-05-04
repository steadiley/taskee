<template>
  <div class="root">
    <h2>{{ runningTask.title }}</h2>
    <h3>
      {{ ellapsedTime.hours }}:{{ ellapsedTime.minutes }}:{{
        ellapsedTime.seconds
      }}
    </h3>
    <button @click="stopTimer">STOP</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "@vue/composition-api";
import { useTaskStore } from "../composables/use_store";

interface Props {
  startedAt: Date;
}

const useEllapsedTime = (
  startedAt: Date
): { hours: number; minutes: number; seconds: number } => {
  const ellapsedTime = reactive<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  onMounted(() => {
    setInterval(() => {
      const ellapsedMillisec = new Date().getTime() - startedAt.getTime();
      ellapsedTime.hours = Math.floor(ellapsedMillisec / (60 * 60 * 1000));
      ellapsedTime.minutes = Math.floor(ellapsedMillisec / (60 * 1000)) % 60;
      ellapsedTime.seconds = Math.floor(ellapsedMillisec / 1000) % 60;
    }, 1000);
  });
  return ellapsedTime;
};

const useStopTimer = () => {
  const taskStore = useTaskStore();
  const stopTimer = async () => {
    await taskStore.stopRunningTask();
  };
  return stopTimer;
};

const TaskList = defineComponent({
  name: "TaskList",
  props: {
    runningTask: Object,
    startedAt: Date,
  },
  setup(props: Props) {
    const ellapsedTime = useEllapsedTime(props.startedAt);
    const stopTimer = useStopTimer();
    return { ellapsedTime, stopTimer };
  },
});
export default TaskList;
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
}
</style>
