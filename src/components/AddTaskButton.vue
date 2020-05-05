<template>
  <UiButton @click.native="showAddForm"> + Add Task </UiButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import UiButton from "@/components/ui/Button.vue";

const AddTaskButton = defineComponent({
  name: "AddTaskButton",
  components: {
    UiButton,
  },
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

<style scoped lang="scss"></style>
