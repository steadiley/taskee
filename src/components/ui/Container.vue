<template>
  <div class="container" :class="colorMode">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

interface Props {
  mode: string;
}

const Container = defineComponent({
  name: "Container",
  props: {
    mode: { type: String, default: "" },
  },
  setup(props: Props) {
    const colorMode =
      props.mode === "dark" ? computed(() => `${props.mode}`) : "";
    return {
      colorMode,
    };
  },
});
export default Container;
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: $background-color;
  &.dark {
    background-color: $darkmode-background-color;
    color: $darkmode-white-op7;
  }
}
</style>
