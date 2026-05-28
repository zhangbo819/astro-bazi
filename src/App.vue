<template>
  <div id="app">
    <router-view />
    <van-tabbar v-if="!route.meta.hiddenCommonTab" route placeholder>
      <van-tabbar-item to="/astrology" icon="home-o">占星</van-tabbar-item>
      <!-- <van-tabbar-item to="/world" icon="search">标签</van-tabbar-item> -->
      <van-tabbar-item to="/china" icon="balance-list-o">500强</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { applyThemeColor } from './utils/util';

// console.log('app in');
const route = useRoute();

applyThemeColor();
</script>

<style lang="scss">
:root {
  /* 将 Vant 的主色调 (Primary) 指向动态主题变量 */
  --van-primary-color: var(--global-theme-color) !important;
}
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

nav {
  padding: 8px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
