import { defineStore } from "pinia";

export const useVirtStore = defineStore("virt", {
  state() {
    return {
      domains: [],
    };
  },
  actions: {
    async updateDomains() {
      const { data: domains } = await useFetch("/api/list-all");
      this.domains.splice(0);
      domains.value.forEach((it) => {
        this.domains.push(it);
      });
    },
  },
});
