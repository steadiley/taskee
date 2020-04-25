import Vue from "vue";
import Vuex from "vuex";
import { TaskState, TaskStore } from "./task";

Vue.use(Vuex);

export interface RootState {
  task: TaskState;
}

export default new Vuex.Store<RootState>({
  modules: {
    task: TaskStore,
  },
});
