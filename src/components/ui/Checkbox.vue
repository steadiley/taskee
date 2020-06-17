<template>
  <div class="d-inline-block">
    <label :for="index" class="checkbox-container">
      <span
        v-if="labelPosition && labelPosition === 'left'"
        class="checkbox-label left"
      >
        {{ label }}
      </span>
      <input
        :id="index"
        type="checkbox"
        :value="inputValue"
        @change="changeValue"
        class="checkbox-input"
      />
      <div class="virtual-checkbox" :class="checkColor.state">
        <div class="virtual-check"></div>
      </div>
      <span
        v-if="!labelPosition || labelPosition === 'right'"
        :for="index"
        class="checkbox-label right"
      >
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "@vue/composition-api";

interface Props {
  value: string;
  label: string;
  name: string;
  color: string;
  index: string;
  labelPosition: string;
}

const Button = defineComponent({
  name: "Checkbox",
  components: {},
  props: {
    value: { type: Array },
    label: { type: String },
    index: { type: String },
    inputValue: { type: String },
    labelPosition: { type: String },
    color: { type: String, default: "green" },
  },
  setup: (props: Props, { emit }) => {
    const checkLabel = computed(() => `${props.label}`);
    const checkIndex = computed(() => `${props.index}`);
    const position = computed(() => `${props.labelPosition}`);
    const checkColor = reactive({ state: props.color });

    const changeValue = (e: any) => {
      let currentValue = [...props.value];
      if (e.target.checked) {
        currentValue.push(e.target.value);
        checkColor.state = reactive(props.color);
      } else {
        checkColor.state = reactive("transparent");
        currentValue = currentValue.filter((item) => item !== e.target.value);
      }
      emit("input", currentValue);
    };
    return {
      checkColor,
      checkLabel,
      checkIndex,
      changeValue,
      position,
    };
  },
});
export default Button;
</script>

<style scoped lang="scss">
$large: 10px 20px;
$medium: 5px 14px;
$small: 4px 10px;

.checkbox-container {
  text-align: center;
  border-radius: $radius-size;
  display: flex;
  align-items: center;
  .checkbox-label {
    &.left {
      padding-right: 7px;
    }
    &.right {
      padding-left: 7px;
    }
  }
  input[type="checkbox"]:checked + .virtual-checkbox {
    border-color: transparent;
    & > .virtual-check {
      display: block;
    }
  }
  .virtual-checkbox {
    top: 0;
    left: 0;
    width: 23px;
    height: 23px;
    display: inline-block;
    border: 1px solid #454545;
    border-radius: $radius-size;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .virtual-check {
    display: none;
    width: 10px;
    height: 15px;
    margin-top: -4px;
    color: $white;
    transform: rotate(40deg);
    border-bottom: 4px solid $white;
    border-right: 4px solid $white;
    border-radius: $radius-size;
  }
  &:not(:active):after {
    animation: anim-ripple 1s ease forwards;
  }
  &:hover {
    &::before {
      opacity: 0.2;
    }
  }
}
</style>
