<template>
  <div class="card-text">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const CardText = defineComponent({
  name: "CardText",
  components: {},
  props: {},
  setup: () => {
    return {};
  },
});
export default CardText;
</script>

<style scoped lang="scss"></style>
