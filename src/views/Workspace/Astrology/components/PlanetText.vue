<template>
  <span v-if="!textOnly" :style="{ color: planentsMap[name].color }"
    ><slot name="prev" />{{ planentsMap[name].name }}<slot />
  </span>
  <template v-else>{{ planentsMap[name].name }}</template>
</template>

<script setup lang="ts">
import { planentsMap } from '@/utils/astro/astroUI';
import { BodyInUse, Planent } from '@/utils/astro/constant';

const props = withDefaults(
  defineProps<{
    name: BodyInUse | Planent;
    textOnly?: boolean;
  }>(),
  {
    name: 'Sun' as BodyInUse,
    textOnly: false,
  }
);
</script>
