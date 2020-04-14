<template>
  <div class="hello">
    <h1>Hello {{ name }}!</h1>
    <input v-model="name" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

const HelloWorld = defineComponent({
  name: "HelloWorld",
  setup() {
    const name = ref<string>("");
    return {
      name,
    };
  },
});
export default HelloWorld;
</script>

<style scoped lang="scss"></style>
