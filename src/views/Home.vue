<template>
  <div class="home">
    <router-link to="/?dueDate=">Backlog</router-link>
    <router-link to="/?dueDate=today">Today</router-link>
    <router-link to="/?dueDate=next-7-days">Next 7 days</router-link>

    <BulletinBoard v-if="runningTask" :runningTask="runningTask" />
    <TaskList :tasks="tasks" :runningTask="runningTask" />
    <UiRow v-if="shouldShowAddForm">
      <UiCol>
        <UiCard>
          <AddTaskForm @cancel="hideAddForm" />
        </UiCard>
      </UiCol>
    </UiRow>
    <template v-else>
      <AddTaskButton @click="showAddForm" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import dayjs from "dayjs";

import AddTaskForm from "@/components/AddTaskForm.vue";
import AddTaskButton from "@/components/AddTaskButton.vue";
import TaskList from "@/components/TaskList.vue";
import BulletinBoard from "@/components/BulletinBoard.vue";
import { useTaskStore } from "@/composables/use_store";
import UiRow from "@/components/ui/Row.vue";
import UiCol from "@/components/ui/Col.vue";
import UiCard from "@/components/ui/Card.vue";
import { useRoute } from "@/composables/user_router";

const Home = defineComponent({
  name: "Home",
  components: {
    AddTaskForm,
    AddTaskButton,
    BulletinBoard,
    TaskList,
    UiRow,
    UiCol,
    UiCard,
  },
  setup() {
    const taskStore = useTaskStore();
    const route = useRoute();

    const shouldShowAddForm = ref(false);
    const showAddForm = () => {
      shouldShowAddForm.value = true;
    };
    const hideAddForm = () => {
      shouldShowAddForm.value = false;
    };
    const filteredTasks = computed(() => {
      const tasks = taskStore.tasks;
      const now = dayjs();
      switch (route.query.dueDate) {
        case undefined:
        case "next-7-days":
          return tasks.filter(
            (task) =>
              task.dueDate &&
              now.startOf("day").toDate() <= task.dueDate &&
              task.dueDate <= now.add(6, "day").endOf("day").toDate()
          );
        case "today":
          return tasks.filter(
            (task) =>
              task.dueDate &&
              now.startOf("day").toDate() <= task.dueDate &&
              task.dueDate <= now.endOf("day").toDate()
          );
        default:
          return tasks.filter((task) => !task.dueDate);
      }
    });
    const runningTask = computed(() => {
      return taskStore.runningTask;
    });
    return {
      shouldShowAddForm,
      showAddForm,
      hideAddForm,
      tasks: filteredTasks,
      runningTask,
    };
  },
});
export default Home;
</script>
