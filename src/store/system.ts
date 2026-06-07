import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', () => {
  const loading = ref(false);

  return {
    loading,
  };
});
