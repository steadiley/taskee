<template>
  <div class="card" :class="[addState, colorMode]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

interface Props {
  state: string;
  mode: string;
}

const Card = defineComponent({
  name: "Card",
  components: {},
  props: {
    state: { type: String, default: "" },
    mode: { type: String, default: "" },
  },
  setup: (props: Props) => {
    const addState = computed(() =>
      props.state === "active" || props.state === "disabled"
        ? `${props.state}`
        : ""
    );
    const colorMode = computed(() =>
      props.mode === "dark" ? `${props.mode}` : ""
    );
    return {
      addState,
      colorMode,
    };
  },
});
export default Card;
</script>

<style scoped lang="scss">
.card {
  border-radius: $radius-size;
  box-shadow: $shadow-type-default;
  background-color: $white;
  border: 1px solid transparent;
  &.active {
    border-color: $green;
    color: $white;
    background-color: $green;
  }
  &.disabled {
    border-color: $green;
    color: $green;
    opacity: 0.5;
  }
  &.dark {
    background-color: $darkmode-black;
    box-shadow: $darkmode-shadow-type-default;
    &.active {
      background-color: $darkmode-gray;
    }
    &.disabled {
      border-color: $darkmode-green;
      color: $darkmode-green;
      background-color: transparent;
      opacity: 0.5;
    }
  }
}

// darkmode
.dark {
  .card {
    border-color: $white-op5;
    color: $white-op7;
    background-color: $darkmode-black;
    box-shadow: $darkmode-shadow-type-default;
    &.active {
      background-color: $darkmode-gray;
    }
    &.disabled {
      border-color: $darkmode-green;
      color: $darkmode-green;
      background-color: transparent;
      opacity: 0.5;
    }
  }
}
</style>
