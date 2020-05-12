import {
  inject,
  provide,
  reactive,
  watch,
  toRefs,
  Ref,
} from "@vue/composition-api";
import VueRouter, { Route } from "vue-router";

const RouterSymbol = Symbol();

interface RouterObject {
  router: VueRouter;
  route: Route;
}

type ReactiveRouterObject = {
  router: VueRouter;
  route: Route;
};

export function provideRouter({ router, route }: RouterObject) {
  provide(RouterSymbol, { router, route });
}

export function useRouter(): ReactiveRouterObject {
  const routerObj = inject(RouterSymbol) as RouterObject | undefined;
  if (!routerObj) {
    throw new Error("Router object is not provided");
  }
  const state = reactive<{ route: Route }>({ route: routerObj.route });

  watch(
    () => routerObj.route,
    (r) => {
      state.route = r;
    }
  );
  return { route: state.route as any, router: routerObj.router };
}
