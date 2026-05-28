<template>
  <van-nav-bar title="详情" left-text="返回" left-arrow @click-left="onClickLeft" />

  <template v-if="activeBottom === 0">
    <Astrology />
  </template>
  <template v-else-if="activeBottom === 1">
    <Bazi />
  </template>

  <van-tabbar
    v-model="activeBottom"
    placeholder
    :style="{
      '--van-tabbar-z-index': 100,
    }"
  >
    <van-tabbar-item icon="home-o">星盘</van-tabbar-item>
    <van-tabbar-item icon="search">八字</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAstroStore } from '@/store/astro';
import Astrology from './Astrology/indexPage.vue';
import Bazi from './Bazi/indexPage.vue';

const store = useAstroStore();

const activeBottom = ref(0);

const route = useRoute();

watch(
  () => route.query.time,
  (val) => {
    if (Number(val) !== store.time.getTime()) {
      store.setTime(Number(val));
    }
  },
  {
    immediate: true,
  }
);

const onClickLeft = () => history.back();
</script>

<!-- <style lang="scss">
.van-cell__title {
  text-align: left;
}
</style> -->
