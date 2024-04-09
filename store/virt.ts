import { defineStore } from "pinia";

type Domains = {
  name: string;
  vcpu: string;
  memory: string;
};

export const useVirtStore = defineStore("virt", {
  state() {
    return {
      domains: [] as Domains[],
    };
  },
  actions: {
    async updateDomains() {
      const { data: domains } = await useFetch<Domains[]>("/api/list-all");
      if (!domains.value) return;
      this.domains.splice(0);
      domains.value.forEach((it) => {
        this.domains.push(it);
      });
    },
  },
});
