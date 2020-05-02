<template>
  <UiRow>
    <UiCol v-for="task in tasks" :key="task.id" cols="10">
      <UiCard>
        <UiCardSubTitle>{{ task.title }}</UiCardSubTitle>
      </UiCard>
    </UiCol>
  </UiRow>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import UiRow from "@/components/ui/Row.vue";
import UiCol from "@/components/ui/Col.vue";
import UiCard from "@/components/ui/Card.vue";
import UiCardSubTitle from "@/components/ui/card/CardSubTitle.vue";

const TaskList = defineComponent({
  name: "TaskList",
  components: {
    UiRow,
    UiCol,
    UiCard,
    UiCardSubTitle,
  },
  props: {
    tasks: Array,
  },
});
export default TaskList;
</script>

<style scoped lang="scss"></style>
