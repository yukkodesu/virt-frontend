import { defineStore } from "pinia";
import dayjs from "dayjs";

interface UserPayloudInterface {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isLogin: false,
      loading: false,
      user: {
        username: "",
      },
    };
  },
  actions: {
    initUserInfo() {
      const user = useCookie("user");
      if (!user.value) return;
      this.user.username = user.value;
    },
    async authenticateUser({ username, password }: UserPayloudInterface) {
      this.loading = true;
      await $fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          username,
          password,
        },
      });
      this.loading = false;
      this.isLogin = true;
      this.user.username = username;
    },
    logOut() {
      const token = useCookie("authorization");
      this.isLogin = false;
      token.value = null;
      const user = useCookie("user");
      user.value = null;
    },
  },
});
