<template>
  <Teleport to="body">
    <van-popup v-model:show="store.dialogVisible" round closeable class="bazi-popup">
      <header>
        <h2 class="title">{{ store.dialogTitle }}</h2>
      </header>
      <section>
        <p class="text">{{ store.dialogText }}</p>
        <!-- 这里放你的八字内容 -->
        <!-- <slot :payload="store.payload">
            <pre>{{ store.payload }}</pre>
          </slot> -->
      </section>
    </van-popup>
  </Teleport>
</template>

<script setup lang="ts">
import { useBaziStore } from '@/store/bazi';

const store = useBaziStore();
</script>

<style scoped>
.bazi-popup {
  padding: 0 2em 1em;
  min-width: 50%;
  max-width: 90%;
  max-height: 80%;
  text-align: left;

  h2 {
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
  }
  .title {
    margin-bottom: 0;
    color: #000;
    font-weight: bold;
  }
  .text {
    margin-top: 0;
    white-space: pre-line;
    line-height: 1.6;
    color: #666;
    font-size: 16px;
  }
}
</style>
