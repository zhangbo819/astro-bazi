<template>
  <div class="container">
    <!-- 修改性别 暂时放这 -->
    <van-cell
      is-link
      title="修改性别"
      :value="store.sex === 0 ? '男' : '女'"
      :style="{ '--van-cell-value-color': 'var(--global-theme-color)' }"
      @click="showSex = true"
    />
    <!-- :style="{ '--van-cell-value-color': store.sex === 0 ? '#6C8EBF' : '#D5A6BD' }" -->
    <van-action-sheet
      v-model:show="showSex"
      :actions="sexActions"
      close-on-click-action
      @select="onSelect"
    />

    <!-- 八字盘 -->
    <div class="baziPan">
      <!-- 标题 -->
      <div style="margin-top: 10px" class="pan-row">
        <div class="pan-item-title" />
        <div v-for="item in store.pillarShowData" :key="item.title" class="pan-item">
          <p class="title">{{ item.title }}</p>
        </div>
      </div>
      <!-- 十神 -->
      <div style="margin-top: 5px" class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">主星</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'zhuxing' + item.tg + index"
          class="pan-item"
        >
          <TouchModal :text="item.zhuxing">
            <p class="tenText">{{ item.zhuxing }}</p>
          </TouchModal>
        </div>
      </div>
      <!-- 天干 -->
      <div style="margin-top: 5px" class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">天干</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'tg' + item.tg + index"
          class="pan-item"
        >
          <wuxing-text :text="item.tg" />
        </div>
      </div>
      <!-- 地支 -->
      <div class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">地支</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'dz' + item.tg + index"
          class="pan-item"
        >
          <WuxingText :text="item.dz" />
        </div>
      </div>
      <!-- 藏干 -->
      <div
        v-for="(_, index) in cgMaxLength"
        :key="'cg_row_' + index"
        style="margin-top: 5px"
        class="pan-row"
      >
        <div class="pan-item-title">
          <p v-if="index === 0" class="subheading">藏干</p>
        </div>
        <div
          v-for="(item, y) in store.pillarShowData"
          :key="'dzcg' + item.dzcg + index + y"
          class="pan-item"
        >
          <WuxingText
            :text="item.dzcg[index]"
            :touch-modal-text="item.dzcg[index]?.[0]"
            size="mini"
          />
        </div>
      </div>
      <!-- 副星 -->
      <div
        v-for="(_, index) in cgMaxLength"
        :key="'fx_row_' + index"
        style="margin-top: 5px"
        class="pan-row"
      >
        <div class="pan-item-title">
          <p v-if="index === 0" class="subheading">副星</p>
        </div>
        <div
          v-for="(item, y) in store.pillarShowData"
          :key="'fx' + item.fx[index] + index + y"
          class="pan-item"
        >
          <TouchModal :text="store.paipanInfo.tenMap[item.fx[index]]">
            <p class="tenText">
              {{ item.fx_text[index] }}
            </p>
          </TouchModal>
        </div>
      </div>
      <!-- 12长生 星运 -->
      <div style="margin-top: 5px" class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">星运</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'xingyun' + item.xingyun + index"
          class="pan-item"
        >
          <TouchModal :text="item.xingyun">
            <p class="tenText">
              {{ item.xingyun }}
            </p>
          </TouchModal>
        </div>
      </div>
      <!-- 12长生 自坐 -->
      <div style="margin-top: 5px" class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">自坐</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'zizuo' + item.zizuo + index"
          class="pan-item"
        >
          <TouchModal :text="item.zizuo">
            <p class="tenText">
              {{ item.zizuo }}
            </p>
          </TouchModal>
        </div>
      </div>
      <!-- 纳音 -->
      <div style="margin: 5px 0 3px" class="pan-row">
        <div class="pan-item-title">
          <p class="subheading">纳音</p>
        </div>
        <div
          v-for="(item, index) in store.pillarShowData"
          :key="'nayin' + item.nayin + index"
          class="pan-item"
        >
          <TouchModal :text="item.nayin">
            <p class="nayin" :style="{ color: WuXing.getColorByWuxing(item.nayin[2]) }">
              {{ item.nayin }}
            </p>
          </TouchModal>
        </div>
      </div>
      <!-- 神煞 -->
      <div
        v-for="(_, index) in ssMaxLength"
        :key="'ss_row_' + index"
        style="margin-top: 2px"
        class="pan-row"
      >
        <div class="pan-item-title">
          <p v-if="index === 0" class="subheading">神煞</p>
        </div>
        <div
          v-for="(item, y) in store.pillarShowData"
          :key="'ss' + item.ss[index] + index + y"
          class="pan-item"
        >
          <TouchModal :title="item.ss[index]" :text="Shensha.getDetails(item.ss[index])">
            <p class="shensha">
              {{ item.ss[index] }}
            </p>
          </TouchModal>
        </div>
      </div>
    </div>

    <!-- 天干地支关系 -->
    <div class="tgDzRelation">
      <div class="row">
        <p class="tgDzRelationTitle">天干留意</p>
        <div>
          <template v-for="i in tgdz_relation.tg" :key="'relation_tg_row' + i.index">
            <span v-for="j in i.relation" :key="'relation_tg' + i.index + j.index" class="tgGxItem">
              {{ j.text }}
            </span>
          </template>
        </div>
      </div>
      <div class="row">
        <p class="tgDzRelationTitle">地支留意</p>
        <div>
          <template v-for="i in tgdz_relation.dz" :key="'relation_dz_row' + i.index">
            <span v-for="j in i.relation" :key="'relation_dz' + i.index + j.index" class="tgGxItem">
              {{ j.text }}
            </span>
          </template>
        </div>
      </div>
    </div>
    <!-- 大运流年 -->
    <DaYunTable />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Shensha, WuXing } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';
import WuxingText from '../components/WuxingText.vue';
import TouchModal from '../components/TouchModal.vue';
import DaYunTable from '../components/DaYunTable.vue';

const store = useBaziStore();

// 修改性别 暂时放这
const showSex = ref(false);
const sexActions = [
  { name: '男', id: 0 },
  { name: '女', id: 1 },
];
const onSelect = (item: { name: string; id: 0 | 1 }) => {
  store.sex = item.id;
};

// 找到藏干中最大的个数，来渲染藏干有几行
const cgMaxLength = computed(() =>
  store.pillarShowData.reduce((r, i) => {
    if (i.dzcg.length > r) {
      r = i.dzcg.length;
    }
    return r;
  }, 0)
);
const ssMaxLength = computed(() =>
  store.pillarShowData.reduce((r, i) => {
    if (i.ss.length > r) {
      r = i.ss.length;
    }
    return r;
  }, 0)
);

const tgdz_relation = computed(() => ({
  tg: WuXing.getTgRelation(store.pillarShowData.map((i) => i.tg)),
  dz: WuXing.getDzRelation(store.pillarShowData.map((i) => i.dz)),
}));
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.container {
  background-color: #fafafa;
}

.baziPan {
  width: 100%;

  .pan-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    .pan-item-title {
      flex: 4;
    }
    .pan-item {
      flex: 5;
    }
  }
}
.title {
  text-align: center;
}
.subheading {
  font-size: 16px;
  color: #9f9f9f;
  text-align: center;
}
.tenText {
  color: #4b4b4b;
  text-align: center;
}
.nayin {
  text-align: center;
}
.shensha {
  color: #b2955e;
  text-align: center;
}

.row {
  display: flex;
  flex-direction: row;
}
.tgDzRelation {
  margin: 12px 0;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;

  .tgDzRelationTitle {
    margin-right: 8px;
    font-weight: bold;
    color: var(--van-primary-color);
    font-size: 16px;
    white-space: nowrap;
  }
  .tgGxItem {
    margin: 0 4px;
    font-size: 16px;
  }
}
</style>
