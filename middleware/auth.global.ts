import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  // const { isLogin } = storeToRefs(useAuthStore());
  // const token = useCookie("authorization");
  // if (token.value) {
  //   isLogin.value = true;
  // }
  // if (token.value && to?.name === "login") {
  //   return navigateTo("/");
  // }

  // if (!token.value && to?.name != "login") {
  //   abortNavigation();
  //   return navigateTo("/login");
  // }
});
