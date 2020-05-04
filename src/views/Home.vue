<template>
  <div class="home">
    <BulletinBoard
      v-if="runningTask"
      :runningTask="runningTask"
      :startedAt="new Date()"
    />
    <TaskList :tasks="tasks" :runningTask="runningTask" />
    <UiRow v-if="shouldShowAddForm">
      <UiCol>
        <UiCard>
          <AddTaskForm @cancel="hideAddForm" />
        </UiCard>
      </UiCol>
    </UiRow>
    <template v-else>
      <AddTaskButton @click="addClickEvent" />
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
import UiRow from "@/components/ui/Row.vue";
import UiCol from "@/components/ui/Col.vue";
import UiCard from "@/components/ui/Card.vue";

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
    const shouldShowAddForm = ref(false);
    const addClickEvent = () => {
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
      addClickEvent,
      hideAddForm,
      tasks,
      runningTask,
    };
  },
});
export default Home;
</script>
