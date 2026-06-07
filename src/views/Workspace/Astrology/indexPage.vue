<template>
  <van-tabs v-model:active="activeTop" swipeable animated sticky>
    <van-tab title="基本信息">
      <astro-base />
    </van-tab>
    <van-tab title="星盘分析">
      <astro-analyse />
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useSystemStore } from '@/store/system.js';
import AstroBase from './tabs/AstroBase.vue';
import AstroAnalyse from './tabs/AstroAnalyse.vue';

const systemStore = useSystemStore();

const activeTop = ref(0);

onBeforeMount(() => {
  // console.log('astro onBeforeMount');
  // console.time('astro');
  systemStore.loading = true;
});
onMounted(() => {
  // console.log('astro onMounted');
  // console.timeEnd('astro');
  systemStore.loading = false;
});
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
