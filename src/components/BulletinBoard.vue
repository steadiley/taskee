<template>
  <div class="root">
    <h2>{{ runningTask.title }}</h2>
    <h3>
      {{ ellapsedTime.hours }}:{{
        `${ellapsedTime.minutes}`.padStart(2, "0")
      }}:{{ `${ellapsedTime.seconds}`.padStart(2, "0") }}
    </h3>
    <button @click="stopTimer">STOP</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  onUnmounted,
} from "@vue/composition-api";

import { Task } from "@/domain/entity";
import { useTaskStore } from "../composables/use_store";

interface Props {
  runningTask: { task: Task; startedAt: Date };
}

const calcEllapsedTime = (
  now: Date,
  start: Date
): { hours: number; minutes: number; seconds: number } => {
  const ellapsedMillisec = new Date().getTime() - start.getTime();
  const hours = Math.floor(ellapsedMillisec / (60 * 60 * 1000));
  const minutes = Math.floor(ellapsedMillisec / (60 * 1000)) % 60;
  const seconds = Math.floor(ellapsedMillisec / 1000) % 60;
  return {
    hours,
    minutes,
    seconds,
  };
};

const useEllapsedTime = (
  startedAt: Date
): { hours: number; minutes: number; seconds: number } => {
  const ellapsedTime = reactive(calcEllapsedTime(new Date(), startedAt));
  let timer: number;

  onMounted(() => {
    timer = setInterval(() => {
      const newEllapsedTime = calcEllapsedTime(new Date(), startedAt);
      ellapsedTime.hours = newEllapsedTime.hours;
      ellapsedTime.minutes = newEllapsedTime.minutes;
      ellapsedTime.seconds = newEllapsedTime.seconds;
    }, 1000);
  });
  onUnmounted(() => {
    clearInterval(timer);
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

const BulletinBoard = defineComponent({
  name: "BulletinBoard",
  props: {
    runningTask: Object,
  },
  setup(props: Props) {
    const ellapsedTime = useEllapsedTime(props.runningTask.startedAt);
    const stopTimer = useStopTimer();
    return { ellapsedTime, stopTimer };
  },
});
export default BulletinBoard;
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
}
</style>
