import Vue from "vue";
import Vuex from "vuex";
import { UserState, UserStore } from "./user";
import { TaskState, TaskStore } from "./task";

Vue.use(Vuex);

export interface RootState {
  user: UserState;
  task: TaskState;
}

const createStore = () => {
  return new Vuex.Store<RootState>({
    modules: {
      user: UserStore,
      task: TaskStore,
    },
  });
};

export default createStore;
