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
    justify: { type: String, default: "" },
    align: { type: String, default: "" },
    contents: { type: String, default: "" },
  },
  setup: (props: Props) => {
    const justifyContent = computed(() =>
      props.justify ? `justify-${props.justify}` : ""
    );
    const alignItems = computed(() =>
      props.align ? `align-${props.align}` : ""
    );
    const alignContents = computed(() =>
      props.contents ? `contents-${props.contents}` : ""
    );
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
