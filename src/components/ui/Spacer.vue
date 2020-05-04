<template>
  <div class="spacer"></div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const Spacer = defineComponent({
  name: "Spacer",
  components: {},
  props: {},
  setup: () => {
    return {};
  },
});
export default Spacer;
</script>

<style scoped lang="scss">
.spacer {
  flex-grow: 1;
}
</style>
