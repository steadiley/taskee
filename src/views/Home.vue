<template>
  <div class="home">
    <TaskList :tasks="tasks" />
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
import { useTaskStore } from "@/composables/use_store";

const Home = defineComponent({
  name: "Home",
  components: {
    AddTaskForm,
    AddTaskButton,
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
    return {
      shouldShowAddForm,
      showAddForm,
      hideAddForm,
      tasks,
    };
  },
});
export default Home;
</script>
