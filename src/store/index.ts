import Vue from "vue";
import Vuex from "vuex";
import { TaskState } from "./task";
import { Context } from "@/context_factory";

Vue.use(Vuex);

interface RootState {
  task: TaskState;
}

export const createStore = (context: Context) => {
  return new Vuex.Store<RootState>({
    modules: {
      task: context.taskStore,
    },
  });
};
