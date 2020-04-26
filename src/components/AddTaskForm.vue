<template>
  <div>
    <input v-model="form.title" />
    <input v-model="form.dueDate" type="date" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

const useAddForm = () => {
  const form = reactive({
    title: "",
    dueDate: new Date(),
  });
  const changeTitle = (newTitle: string) => {
    form.title = newTitle;
  };
  const changeDueDate = (newDueDate: Date) => {
    form.dueDate = newDueDate;
  };

  return {
    form,
    changeTitle,
    changeDueDate,
  };
};

const AddTaskForm = defineComponent({
  name: "AddTaskForm",
  props: {
    tasks: Array,
  },
  setup() {
    const form = useAddForm();

    return {
      form,
    };
  },
});
export default AddTaskForm;
</script>

<style scoped lang="scss"></style>
