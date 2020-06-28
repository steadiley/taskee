<template>
  <div class="delete-button" @click="onClick">
    <span class="delete-icon" />
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
.delete-button {
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

.delete-icon {
  font-size: 20px;
  line-height: 0;
}

.delete-icon:before {
  content: "×";
}
</style>
