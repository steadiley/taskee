<template>
  <span class="add-task-button" @click="showAddForm">
    + Add Task
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const AddTaskButton = defineComponent({
  name: "AddTaskButton",
  setup(_, { emit }) {
    const showAddForm = () => {
      emit("click");
    };
    return {
      showAddForm,
    };
  },
});
export default AddTaskButton;
</script>

<style scoped lang="scss">
.add-task-button:hover {
  color: red;
}
</style>
