<template>
  <div class="home">
    <BulletinBoard v-if="runningTask" :runningTask="runningTask" />
    <TaskList :tasks="tasks" :runningTask="runningTask" />
    <div v-if="shouldShowAddForm">
      <AddTaskForm @cancel="hideAddForm" />
    </div>
    <template v-else>
      <AddTaskButton @click="showAddForm" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";

import AddTaskForm from "@/components/AddTaskForm.vue";
import AddTaskButton from "@/components/AddTaskButton.vue";
import TaskList from "@/components/TaskList.vue";
import BulletinBoard from "@/components/BulletinBoard.vue";
import { useTaskStore } from "@/composables/use_store";

const Home = defineComponent({
  name: "Home",
  components: {
    AddTaskForm,
    AddTaskButton,
    BulletinBoard,
    TaskList,
  },
  setup() {
    const taskStore = useTaskStore();

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
    };
  },
});
export default Home;
</script>
