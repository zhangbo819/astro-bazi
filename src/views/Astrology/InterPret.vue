<template>
  <div class="interPret">
    <!-- <p>{{ text }}</p> -->
    <template v-if="!loading">
      {{ result }}
    </template>
    <div v-show="loading" style="margin-top: 16px">
      <van-loading
        color="var(--global-theme-color)"
        size="32px"
        vertical
        style="--van-padding-xs: 12px"
        >回复生成中...</van-loading
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
// import { generateInterpretation, title12 } from '@/utils/astro/astroUI';
// import { BODIES, BodyInUse, Star } from '@/utils/astro/constant';

const route = useRoute();
const loading = ref(false);
const result = ref('');

async function runInterpret(chart: Record<string, any>) {
  loading.value = true;

  const res = await fetch('/api/interpret', {
    method: 'POST',
    body: JSON.stringify({ chart }),
  });

  const data = await res.json();
  result.value = data.text;

  loading.value = false;
}

watch(
  () => route.query,
  () => {
    const { name, sign } = route.query;
    runInterpret({
      name,
      sign,
    });
  },
  { immediate: true }
);

// computed(() => {
//   const { name, sign } = route.query;

//   let res = '';

//   if (
//     typeof name === 'string' &&
//     BODIES.includes(name as BodyInUse) &&
//     typeof sign === 'string' &&
//     title12.includes(sign as Star)
//   ) {
//     res = generateInterpretation(name as BodyInUse, sign as Star);
//   } else {
//     res = '参数错误';
//   }
//   return res;
// });
</script>

<style lang="scss" scoped>
.interPret {
  background-color: #fff;
  padding: 0 2.5vw;

  p {
    text-align: left;
    white-space: pre-line;
    font-weight: bold;
  }
}
</style>
