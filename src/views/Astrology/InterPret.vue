<template>
  <div class="interPret">
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { generateInterpretation, title12 } from '@/utils/astro/astroUI';
import { BODIES, BodyInUse, Star } from '@/utils/astro/constant';

const route = useRoute();

const text = computed(() => {
  const { name, sign } = route.query;

  let res = '';

  if (
    typeof name === 'string' &&
    BODIES.includes(name as BodyInUse) &&
    typeof sign === 'string' &&
    title12.includes(sign as Star)
  ) {
    res = generateInterpretation(name as BodyInUse, sign as Star);
  } else {
    res = '参数错误';
  }
  return res;
});
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
