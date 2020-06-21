<template>
  <div class="close-button" @click="onClick">
    <span class="close-icon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const DeleteButton = defineComponent({
  name: "DeleteButton",
  components: {},
  props: {},
  setup: (_, { emit }) => {
    const onClick = () => {
      emit("click");
    };
    return {
      onClick,
    };
  },
});
export default DeleteButton;
</script>

<style scoped lang="scss">
.close-button {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  color: $darken-gray;
  background-color: $white;
  border: 1px solid $white;
  border-radius: 30px;
  box-shadow: $shadow-type-default;
}

.close-icon {
  font-size: 20px;
  line-height: 0;
}

.close-icon:before {
  content: "×";
}
</style>
