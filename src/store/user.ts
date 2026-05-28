import { defineStore } from 'pinia';

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('user', {
  state(): {
    token: null | string;
  } {
    return {
      token: localStorage.getItem('access_token'),
    };
  },
  actions: {},
});
