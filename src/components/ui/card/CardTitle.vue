<template>
  <div class="card-title fs-150 font-weight-bold">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const CardTitle = defineComponent({
  name: "CardTitle",
  components: {},
  props: {},
  setup: () => {
    return {};
  },
});
export default CardTitle;
</script>

<style scoped lang="scss"></style>
