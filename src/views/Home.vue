<template>
  <div class="home">
    <TaskList />
  </div>
</template>

<script>
import TaskList from "@/components/TaskList.vue";

export default {
  name: "Home",
  components: {
    TaskList,
  },
};
</script>
