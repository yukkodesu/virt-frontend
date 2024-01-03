import { defineStore } from "pinia";

interface UserPayloudInterface {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLogin: false,
    loading: false,
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloudInterface) {
      const { data, pending } = await useFetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          username,
          password,
        },
      });
      this.loading = pending.value;
      if (data.value) {
        const token = useCookie("authorization");
        token.value = `${data.value}`;
        console.log(`auth token ${data.value}`);
        this.isLogin = true;
      }
    },
    logOut() {
      const token = useCookie("authorization");
      this.isLogin = false;
      token.value = null;
    },
  },
});
