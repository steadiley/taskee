import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
  it("renders Hello !", () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper.text()).toMatch("Hello !");
  });
});
