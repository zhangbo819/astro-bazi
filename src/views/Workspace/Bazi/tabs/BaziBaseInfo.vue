<template>
  <div class="bazi-base-info">
    <van-cell-group
      style="--van-cell-vertical-padding: 2px; --van-cell-border-color: #fff"
      :border="false"
    >
      <van-cell :title="`未命名`" />
      <van-cell :title="`性别：${store.paipanInfo.gender ? '女' : '男'}`" />
      <van-cell :title="renderYinYangli(true)" />
      <van-cell :title="renderYinYangli()" />
      <van-cell :title="`节气：${store.paipanInfo.jq_text}`" />
      <van-cell :title="`属相：${store.paipanInfo.sx}`" />
      <van-cell :title="`胎元：${pageData.tms.taiyuan}`" />
      <van-cell :title="`命宫：${pageData.tms.minggong}`" />
      <van-cell :title="`身宫：${pageData.tms.shengong}`" />
    </van-cell-group>

    <div class="block-info">
      <h3>调侯用神</h3>
      <div class="block-text">
        {{ pageData.tiaohou }}
      </div>
    </div>

    <div class="block-info">
      <h3>袁天罡称骨</h3>
      <touch-modal
        :title="'总重: ' + pageData.ytgcgData.weight_text"
        :text="`年${pageData.ytgcgData.weight_y}两 + 月${pageData.ytgcgData.weight_m}两 + 日${pageData.ytgcgData.weight_d}两 + 时${pageData.ytgcgData.weight_h}两`"
      >
        <p class="block-title">{{ pageData.ytgcgData.weight_text }}</p>
      </touch-modal>
      <p class="block-text">{{ pageData.ytgcgData.comment }}</p>
      <i>称骨法作为扩展有一定的参考作用，但具体情况还是要结合全局分析</i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NaYin, WuXing, Ytgcg } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';
import TouchModal from '../components/TouchModal.vue';

const store = useBaziStore();

const pageData = computed(() => {
  const infoBazi = store.paipanInfo.bazi;

  const tiaohou = WuXing.getTiaohou(infoBazi);

  const ytgcgData = Ytgcg.getData(infoBazi, store.paipanInfo.yinli[1], store.paipanInfo.yinli[2]);

  const { taiyuan, minggong, shengong } = WuXing.getTMS(infoBazi);

  return {
    ytgcgData,
    tiaohou,
    tms: {
      taiyuan: `${taiyuan} (${NaYin.getNayin(taiyuan)})`,
      minggong: `${minggong} (${NaYin.getNayin(minggong)})`,
      shengong: `${shengong} (${NaYin.getNayin(shengong)})`,
    },
  };
});

const renderYinYangli = (isYang = false) => {
  const paipanInfo = store.paipanInfo;
  if (paipanInfo === null) {
    return '';
  }
  const arr = (isYang ? paipanInfo.yangli : paipanInfo.yinli) || [];
  let res = `${isYang ? '阳历' : '阴历'}：${arr[0]}年${arr[1]}月${arr[2]}日 `;
  res += isYang ? `${paipanInfo.hh}:${paipanInfo.mt}` : `${paipanInfo.bazi?.[3]?.[1]}时`;
  return res;
};
</script>

<style lang="scss" scoped>
.bazi-base-info {
  min-height: 100vh;
  background-color: #fafafa;

  .block-info {
    background-color: #fff;
    margin-top: 24px;
    padding: 8px;
    h3 {
      text-align: center;
    }
    .block-title {
      font-weight: bold;
      color: var(--global-theme-color);
    }
    .block-text {
      margin-top: 8px;
      font-size: 16px;
    }
  }
}
</style>
