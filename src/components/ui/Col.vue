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
    order: { type: String, default: "" },
    cols: { type: String, default: "" },
    self: { type: String, default: "" },
  },
  setup: (props: Props) => {
    const orderItem = computed(() =>
      props.order ? `order-${props.order}` : ""
    );
    const colsItem = computed(() => (props.cols ? `cols-${props.cols}` : ""));
    const selfItem = computed(() => (props.self ? `self-${props.self}` : ""));
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
