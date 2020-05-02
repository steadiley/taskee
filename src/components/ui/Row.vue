<template>
  <div class="row" :class="[justifyContent, alignItems, alignContents]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

interface Props {
  justify: string;
  align: string;
  contents: string;
}

const Row = defineComponent({
  name: "Row",
  components: {},
  props: {
    justify: { type: String, defalut: "" },
    align: { type: String, defalut: "" },
    contents: { type: String, defalut: "" },
  },
  setup: (props: Props) => {
    const justifyContent = props.justify
      ? computed(() => `justify-${props.justify}`)
      : "";
    const alignItems = props.align
      ? computed(() => `align-${props.align}`)
      : "";
    const alignContents = props.contents
      ? computed(() => `contents-${props.contents}`)
      : "";
    return {
      justifyContent,
      alignItems,
      alignContents,
    };
  },
});
export default Row;
</script>

<style scoped lang="scss">
.row {
  display: flex;
  flex-wrap: wrap;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
</style>
