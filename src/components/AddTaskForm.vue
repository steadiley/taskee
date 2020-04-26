<template>
  <form @submit="submit">
    <input class="title-text-box" v-model="form.title" />
    <input class="due-date-text-box" v-model="form.dueDate" type="date" />
    <button type="submit">Add</button>
    <button @click="hideAddForm">Cancel</button>
  </form>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, reactive } from "@vue/composition-api";
import { useTaskStore } from "../composables/use_store";

const useAddForm = (emit: (event: string) => void) => {
  const taskStore = useTaskStore();
  const form = reactive({
    title: "",
    dueDate: dayjs().format("YYYY-MM-DD"),
  });
  const hideAddForm = () => {
    emit("cancel");
  };
  const submit = () => {
    taskStore.addTask(form.title, new Date(form.dueDate));
  };

  return { form, hideAddForm, submit };
};

const AddTaskForm = defineComponent({
  name: "AddTaskForm",
  props: {
    tasks: Array,
  },
  setup(_, { emit }) {
    const { form, hideAddForm, submit } = useAddForm(emit);

    return {
      form,
      hideAddForm,
      submit,
    };
  },
});
export default AddTaskForm;
</script>

<style scoped lang="scss">
.title-text-box {
  width: 70%;
}
.due-date-text-box {
  width: 30%;
}
</style>
