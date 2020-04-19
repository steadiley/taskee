<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <TodaysTasks />
  </div>
</template>

<script>
// @ is an alias to /src
import TodaysTasks from "@/components/TodaysTasks.vue";

export default {
  name: "Home",
  components: {
    TodaysTasks,
  },
};
</script>
