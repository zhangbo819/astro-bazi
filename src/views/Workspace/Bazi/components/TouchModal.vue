<template>
  <div :class="{ canClick: !disabled }" @click="handleOpen">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBaziStore } from '@/store/bazi';

const modal = useBaziStore();

const props = withDefaults(
  defineProps<{
    title?: string;
    text?: string | null;
    disabled?: boolean;
  }>(),
  {
    title: '',
    text: '',
  }
);

const handleOpen = () => {
  console.log('kkk');
  if (props.disabled) return;
  modal.openDialog({
    title: props.title,
    text: props.text === null ? '' : props.text,
  });
};
</script>

<style lang="scss" scoped>
.canClick {
  cursor: pointer;
}
</style>
