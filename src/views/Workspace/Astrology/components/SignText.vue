<template>
  <span v-if="!textOnly" :style="{ color: map12[name].color }"
    >{{ map12[name].name }}
    <slot />
  </span>
  <template v-else>{{ map12[name].name }}</template>
</template>

<script setup lang="ts">
import { map12 } from '@/utils/astro/astroUI';
import { Star } from '@/utils/astro/constant';

const props = withDefaults(
  defineProps<{
    name: Star;
    textOnly?: boolean;
  }>(),
  {
    name: Star.Aries,
    textOnly: false,
  }
);
</script>
