import { Store } from "vuex";
import { inject, provide } from "@vue/composition-api";
import { getModule } from "vuex-module-decorators";

import { RootState } from "@/store";
import { TaskStore } from "@/store/task";

const StoreSymbol = Symbol();

export function provideStore(store: Store<RootState>) {
  provide(StoreSymbol, store);
}

export function useStore(): Store<RootState> {
  const store = inject(StoreSymbol) as Store<RootState> | undefined;
  if (!store) {
    throw new Error("Store is not provided");
  }
  return store;
}

export function useTaskStore(): TaskStore {
  const store = useStore();
  const taskStore = getModule(TaskStore, store);
  return taskStore;
}
