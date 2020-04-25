import Vuex from "vuex";
import { TaskState, TaskStore } from "./task";

interface RootState {
  task: TaskState;
}

export default Vuex.createStore({
  modules: {
    task: TaskStore,
  },
});
