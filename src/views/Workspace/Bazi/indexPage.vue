<template>
  <van-tabs v-model:active="activeTop" swipeable animated sticky>
    <van-tab title="基本信息">
      <BaziBaseInfo />
    </van-tab>
    <van-tab title="专业细盘">
      <BaziPan />
    </van-tab>
  </van-tabs>

  <!-- 弹窗 -->
  <bazi-modal />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useSystemStore } from '@/store/system.js';
import BaziPan from './tabs/BaziPan.vue';
import BaziBaseInfo from './tabs/BaziBaseInfo.vue';
import BaziModal from './components/BaziModal.vue';

const systemStore = useSystemStore();

const activeTop = ref(1);

onBeforeMount(() => {
  // console.log('bazi onBeforeMount');
  // console.time('bazi');
  systemStore.loading = true;
});
onMounted(() => {
  // console.log('bazi onMounted');
  // console.timeEnd('bazi');
  systemStore.loading = false;
});
</script>
