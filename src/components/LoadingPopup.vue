<template>
  <van-popup v-model:show="store.loading" round class="loading-popup" teleport="body">
    <van-loading
      color="var(--global-theme-color)"
      size="32px"
      vertical
      style="--van-padding-xs: 12px"
      >加载中...</van-loading
    >
  </van-popup>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store/system';

const store = useSystemStore();
</script>

<style lang="scss" scoped>
.loading-popup {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
}
</style>
