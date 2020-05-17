import Vue from "vue";
import { inject, provide, computed } from "@vue/composition-api";
import VueRouter from "vue-router";

const RouterSymbol = Symbol();
const RouteSymbol = Symbol();

interface RouteData {
  params: { [key: string]: any };
  query: { [key: string]: any };
}

export function provideRoute(routeData: RouteData): any {
  provide(RouteSymbol, routeData);
}

export function useRoute() {
  const routeData = inject(RouteSymbol) as RouteData | undefined;
  if (!routeData) {
    throw new Error("Route object is not provided");
  }
  return routeData;
}

export function provideRouter(router: VueRouter) {
  provide(RouterSymbol, router);
}

export function useRouter(): VueRouter {
  const router = inject(RouterSymbol) as VueRouter | undefined;
  if (!router) {
    throw new Error("Router object is not provided");
  }
  return router;
}
