<template>
  <div class="home">
    <div>{{ query }}</div>

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
import { defineComponent, computed, ref, watch } from "@vue/composition-api";

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

    watch(
      () => route,
      async (route) => {
        const dueDate = route.query.dueDate;
        switch (dueDate) {
          case "today":
            await taskStore.fetchTodaysTasks();
            break;
          case "next-7-days":
            await taskStore.fetchTodaysTasks(); // fetch next 7 days tasks
            break;
          default:
            await taskStore.fetchBacklogTasks();
            break;
        }
      },
      { deep: true }
    );

    const shouldShowAddForm = ref(false);
    const showAddForm = () => {
      shouldShowAddForm.value = true;
    };
    const hideAddForm = () => {
      shouldShowAddForm.value = false;
    };
    const tasks = computed(() => taskStore.tasks);
    const runningTask = computed(() => {
      return taskStore.runningTask;
    });
    return {
      shouldShowAddForm,
      showAddForm,
      hideAddForm,
      tasks,
      runningTask,
      query: route,
    };
  },
});
export default Home;
</script>
