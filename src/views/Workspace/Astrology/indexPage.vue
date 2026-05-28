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
import { ref } from 'vue';
import AstroBase from './tabs/AstroBase.vue';
import AstroAnalyse from './tabs/AstroAnalyse.vue';

const activeTop = ref(0);
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
