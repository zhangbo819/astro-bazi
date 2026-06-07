<template>
  <TouchModal :disabled="disabled" :text="touchModalText || text">
    <p
      :class="['wuxing', 'no-copy', { wuxing_mid: size === 'mid', wuxing_mini: size === 'mini' }]"
      :style="{ color: WuXing.getColorByWuxing(color_text) }"
    >
      {{ text }}
    </p>
  </TouchModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DZ, TG, WuXing } from 'astro-bazi-utils';
import TouchModal from './TouchModal.vue';

const props = withDefaults(
  defineProps<{
    text: TG | DZ | string;
    colorText?: string;
    size?: 'default' | 'mid' | 'mini';
    disabled?: boolean;
    touchModalText?: string;
  }>(),
  {
    text: '',
    colorText: undefined,
    size: 'default',
    touchModalText: '',
  }
);

// 五行颜色
const color_text = computed(() => {
  let res = props.colorText;
  if (typeof res === 'undefined') {
    res = props.text.length > 1 ? props.text[0] : props.text;
  }
  return res;
});
</script>

<style lang="scss" scoped>
.wuxing {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.wuxing_mid {
  font-size: 18px;
  font-weight: normal;
}
.wuxing_mini {
  font-size: 16px;
  font-weight: normal;
}
</style>
