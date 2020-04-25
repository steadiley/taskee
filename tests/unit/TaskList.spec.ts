import "reflect-metadata";
import { shallowMount } from "@vue/test-utils";
import TaskList from "@/components/TaskList.vue";

describe("TaskList.vue", () => {
  it("renders backlog tasks", async () => {
    const wrapper = shallowMount(TaskList, {});
    expect(wrapper.findAll("li")).toHaveLength(3);
  });
});
