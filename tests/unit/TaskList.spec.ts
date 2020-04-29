import { shallowMount } from "@vue/test-utils";

import TaskList from "@/components/TaskList.vue";
import { Task } from "@/domain/entity";

describe("TaskList.vue", () => {
  it("renders backlog tasks", async () => {
    const wrapper = shallowMount(TaskList, {
      propsData: {
        tasks: [new Task("1", "brush my teeth"), new Task("2", "go to work")],
      },
    });
    expect(wrapper.findAll("li")).toHaveLength(2);
  });
  it("renders empty tasks", async () => {
    const wrapper = shallowMount(TaskList, {
      propsData: {
        tasks: [],
      },
    });
    expect(wrapper.findAll("li")).toHaveLength(0);
  });
});
