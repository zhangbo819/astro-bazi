<template>
  <div style="width: 100%">
    <van-collapse v-model="activeTab">
      <van-nav-bar right-text="星盘详情" @click-right="onClickRight">
        <template #left>
          <van-button
            type="primary"
            plain
            style="--van-button-border-width: 0"
            @click="onClickLeft"
            :loading="AIBtnLoading"
            loading-text="加载中..."
            >AI 解读</van-button
          >
        </template>
        <template #title>
          <h1 style="font-size: 1.6em; line-height: 1.6em">Astrology</h1>
        </template>
      </van-nav-bar>

      <!-- 星座盘 -->
      <astro-round-plate :data="data" />

      <!-- 操作栏 -->
      <h2>操作栏</h2>
      <astro-operation v-model:time="time" />

      <!-- <van-collapse-item name="5">
        <template #title></template>
      </van-collapse-item> -->

      <!-- 参数详情列表 -->
      <van-collapse-item name="2">
        <template #title>
          <h2>参数详情列表</h2>
        </template>
        <van-cell-group inset>
          <van-cell
            v-for="item in data"
            :key="item.name"
            :title="`${item.name} ${planentsMap[item.name].name}`"
            :title-style="{ color: planentsMap[item.name].color }"
          >
            <template #label>
              <span :style="{ color: DignityMap[item.dignity].color }">{{
                DignityMap[item.dignity].text
              }}</span>
            </template>

            <p class="value" :style="{ color: map12[item.sign].color }">
              {{ item.sign }} {{ map12[item.sign].name }}
              <span v-if="item.retrograde">R</span>
            </p>

            <p class="value">{{ item.degree }}°</p>
          </van-cell>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
  </div>

  <AIPopup />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import router from '@/router';
import { useAIStore } from '@/store/AI';
import { getAllPlanets } from '@/utils/astro/planets';
import { DignityMap, map12, planentsMap } from '@/utils/astro/astroUI';
import AstroOperation from '@/views/Workspace/Astrology/components/AstroOperation.vue';
import AstroRoundPlate from '@/views/Workspace/Astrology/components/AstroRoundPlate.vue';
import AIPopup from '@/components/AIPopup.vue';
import { useAstroStore } from '@/store/astro';

const storeAI = useAIStore();
const storeAstro = useAstroStore();
// const time = ref(new Date('2013-07-29T04:30:00Z'));
// const time = ref(new Date('2010-08-07T00:00:00Z'));
const time = ref(storeAstro.time);

const data = computed(() => {
  return getAllPlanets(time.value);
});

const activeTab = ref(new Array(6).fill(0).map((_, i) => String(i + 1)));
const onClickRight = () => {
  // 将秒和毫秒清零，方便浏览器保存参数
  const newDate = new Date(time.value);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  router.push({
    path: '/workspace',
    query: { time: newDate.getTime(), tab: 0 },
  });
};

const AIBtnLoading = ref(false);

const onClickLeft = async () => {
  const param = data.value.map(({ name, sign, retrograde, dignity }) => {
    const item: Record<string, string | boolean> = { name, sign };
    if (retrograde) {
      item.retrograde = retrograde;
    }
    if (dignity !== 'Peregrine') {
      item.dignity = dignity;
    }
    return item;
  });
  // console.log(param);

  AIBtnLoading.value = true;
  await storeAI.apiGetInterPret(param);
  AIBtnLoading.value = false;
};
</script>

<style lang="scss" scoped>
p,
h1 {
  margin: 0;
}

h2 {
  text-align: center;
}

.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}
</style>
