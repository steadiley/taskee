<template>
  <div class="card-subtitle fs-125">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const CardSubTitle = defineComponent({
  name: "CardSubTitle",
  components: {},
  props: {},
  setup: () => {
    return {};
  },
});
export default CardSubTitle;
</script>

<style scoped lang="scss"></style>
