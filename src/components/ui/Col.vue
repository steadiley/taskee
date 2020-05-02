<template>
  <div class="col" :class="[orderItem, colsItem, selfItem]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

interface Props {
  order: string;
  cols: string;
  self: string;
}

const Col = defineComponent({
  name: "Col",
  components: {},
  props: {
    order: { type: String, defalut: "" },
    cols: { type: String, defalut: "" },
    self: { type: String, defalut: "" },
  },
  setup: (props: Props) => {
    const orderItem = props.order ? computed(() => `order-${props.order}`) : "";
    const colsItem = props.cols ? computed(() => `cols-${props.cols}`) : "";
    const selfItem = props.self ? computed(() => `self-${props.self}`) : "";
    return {
      orderItem,
      colsItem,
      selfItem,
    };
  },
});
export default Col;
</script>

<style scoped lang="scss">
.col {
  flex-basis: 0px;
  flex-grow: 1;
  max-width: 100%;
  padding: 0.6rem;
}

@for $i from 1 through 10 {
  .order-#{$i} {
    order: $i;
  }
  .cols-#{$i} {
    max-width: #{$i}0%;
    flex-basis: percentage($i);
  }
}
</style>
