<template>
  <van-popup v-model:show="storeAI.showDialog" round class="interpret-popup" teleport="body">
    <div v-show="storeAI.loading" style="margin-top: 16px; padding: 16px">
      <van-loading
        color="var(--global-theme-color)"
        size="32px"
        vertical
        style="--van-padding-xs: 12px"
        >解读生成中...</van-loading
      >
    </div>
    <div
      v-if="!storeAI.loading"
      class="markdown-body"
      style="padding: 16px"
      v-html="renderMarkdown(storeAI.result)"
    />
  </van-popup>
</template>

<script lang="ts" setup>
import { useAIStore } from '@/store/AI';
import { renderMarkdown } from '@/utils/util';

const storeAI = useAIStore();
</script>

<style lang="scss" scoped>
.interpret-popup {
  max-height: 90%;
  max-width: 90%;
  // padding: 16px;
}
</style>
