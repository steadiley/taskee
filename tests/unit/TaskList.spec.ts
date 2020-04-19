import "reflect-metadata";
import { shallowMount } from "@vue/test-utils";
import TaskList from "@/components/TaskList.vue";

import { getResolvedContext } from "@/context_factory";

describe("TaskList.vue", () => {
  it("renders backlog tasks", async () => {
    const context = getResolvedContext();
    const wrapper = shallowMount(TaskList, {
      provide: context,
    });
    expect(wrapper.findAll("li")).toHaveLength(3);
  });
});
