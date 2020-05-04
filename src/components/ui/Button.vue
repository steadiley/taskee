<template>
  <div class="button" :class="[buttonColor, buttonSize]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, SetupContext } from "@vue/composition-api";

interface Props {
  color: string;
  size: string;
}

const Button = defineComponent({
  name: "Button",
  components: {},
  props: {
    state: { type: String, defalut: "" },
    size: { type: String, defalut: "" },
  },
  setup: (props: Props, context: SetupContext) => {
    const buttonColor = props.color
      ? computed(() => `${props.color}`)
      : "green";
    const buttonSize = props.size ? computed(() => `${props.size}`) : "";
    const addClickEvent = () => {
      context.emit("click");
    };
    return {
      buttonColor,
      buttonSize,
      addClickEvent,
    };
  },
});
export default Button;
</script>

<style scoped lang="scss">
@keyframes anim-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  30% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    background-color: rgba(255, 255, 255, 0);
    opacity: 0;
  }
}

$large: 10px 20px;
$medium: 5px 14px;
$small: 4px 10px;

.button {
  text-align: center;
  padding: $medium;
  border-radius: $radius-size;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-block;
  position: relative;
  z-index: 1;
  overflow: hidden;
  color: $white;
  &.large {
    padding: $large;
  }
  &.small {
    padding: $small;
    font-size: 85%;
  }
  &::before {
    content: "";
    overflow: hidden;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: $radius-size;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: $white;
    transition: ease 0.3s;
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(0);
    border-radius: 50%;
    z-index: -1;
    opacity: 0;
  }
  &:not(:active):after {
    animation: anim-ripple 1s ease forwards;
  }
  &:hover {
    &::before {
      opacity: 0.2;
    }
  }
  &.green {
    background-color: $green;
  }
}
.dark {
  &.button {
    background-color: $darkmode-green;
  }
}
</style>
