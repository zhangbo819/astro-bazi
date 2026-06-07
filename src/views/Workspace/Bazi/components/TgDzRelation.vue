<template>
  <div class="tgDzRelation no-copy" @click="dialogVisible = true">
    <Row>
      <p class="tgDzRelationTitle">天干留意</p>
      <div>
        <template v-for="i in tgdz_relation.tg" :key="'relation_tg_row' + i.index">
          <span v-for="j in i.relation" :key="'relation_tg' + i.index + j.index" class="tgGxItem">
            {{ j.text }}
          </span>
        </template>
      </div>
    </Row>
    <Row>
      <p class="tgDzRelationTitle">地支留意</p>
      <div>
        <template v-for="i in tgdz_relation.dz" :key="'relation_dz_row' + i.index">
          <span v-for="j in i.relation" :key="'relation_dz' + i.index + j.index" class="tgGxItem">
            {{ j.text }}
          </span>
        </template>
      </div>
    </Row>
  </div>

  <!-- 弹窗 -->
  <van-popup v-model:show="dialogVisible" round closeable class="tgdz-modal" teleport="body">
    <header>
      <h2 class="title">天干地支关系</h2>
    </header>
    <section class="no-copy">
      <div class="scroll-content">
        <!-- {{ tgdz_relation.tg }} -->
        <template v-for="item in tgdz_relation.tg">
          <Row v-for="i in item.relation" :key="'tg_' + i.index" style="margin: 16px 0">
            <template v-for="(_, index) in store.pillarShowData">
              <Col v-if="index < i.index || index > item.index" :key="'tg_empty_' + index" />
              <Col
                v-else-if="index === i.index"
                :key="'tg_text_' + i.name + index"
                :style="{ flex: item.index - i.index + 1 }"
                class="lineBg"
              >
                <Row class="relationItemRow">
                  <!-- 左侧字 -->
                  <Row style="flex: 1">
                    <Col />
                    <p
                      class="relationItem"
                      :style="{
                        color: WuXing.getColorByWuxing(i.name),
                      }"
                    >
                      {{ i.name }}
                    </p>
                    <Col class="lineBg"><div class="line" /></Col>
                  </Row>

                  <!-- 中间的连线 -->
                  <Col
                    v-for="(_, j) in item.index - i.index - 1"
                    :key="'dz_text_empty' + j"
                    class="lineBg"
                  >
                    <div class="line"
                  /></Col>

                  <!-- 右侧字 -->
                  <Row style="flex: 1">
                    <Col class="lineBg"><div class="line" /></Col>
                    <p
                      class="relationItem"
                      :style="{
                        color: WuXing.getColorByWuxing(item.name),
                      }"
                    >
                      {{ item.name }}
                    </p>
                    <Col />
                  </Row>
                </Row>
                <p class="relationText">{{ i.text }}</p>
              </Col>
            </template>
          </Row>
        </template>
      </div>

      <Row style="margin-bottom: 16px">
        <Col v-for="i in store.pillarShowData" :key="i.title">
          <p class="subheading">{{ i.title }}</p>
          <WuxingText disabled :text="i.tg" />
          <WuxingText disabled :text="i.dz" />
        </Col>
      </Row>

      <div class="scroll-content">
        <!-- {{ tgdz_relation.dz }} -->
        <template v-for="item in tgdz_relation.dz">
          <Row
            v-for="relation in item.relation"
            :key="'dz_' + relation.start + relation.text"
            style="margin: 16px 0"
          >
            <template v-for="(_, index) in store.pillarShowData">
              <Col v-if="index < relation.start || index > item.end" :key="'dz_empty_' + index" />
              <Col
                v-else-if="index === relation.start"
                :key="'dz_text_' + relation.name + index"
                :style="{ flex: item.end - relation.start + 1 }"
                class="lineBg"
              >
                <Row class="relationItemRow">
                  <!-- 左侧字 -->
                  <template v-for="(_, j) in item.end - relation.start">
                    <Row
                      v-if="getRelationIndex(relation, j) !== -1"
                      :key="'dz_text' + j"
                      style="flex: 1"
                    >
                      <Col v-if="j === 0" />
                      <Col v-else class="lineBg"><div class="line" /></Col>
                      <p
                        class="relationItem"
                        :style="{
                          color: WuXing.getColorByWuxing(
                            relation.name[getRelationIndex(relation, j)]
                          ),
                        }"
                      >
                        {{ relation.name[getRelationIndex(relation, j)] }}
                      </p>
                      <Col class="lineBg"><div class="line" /></Col>
                    </Row>
                    <!-- 中间的线 -->
                    <Col v-else :key="'dz_text_empty' + j" class="lineBg">
                      <div class="line" />
                    </Col>
                  </template>

                  <!-- 右侧字 -->
                  <Row style="flex: 1">
                    <Col class="lineBg"><div class="line" /></Col>
                    <p
                      class="relationItem"
                      :style="{
                        color: WuXing.getColorByWuxing(item.name),
                      }"
                    >
                      {{ item.name }}
                    </p>
                    <Col />
                  </Row>
                </Row>
                <p class="relationText">{{ relation.text }}</p>
              </Col>
            </template>
          </Row>
        </template>
      </div>
    </section>
  </van-popup>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { WuXing } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';
import Row from '@/components/Row.vue';
import Col from '@/components/Col.vue';
import WuxingText from './WuxingText.vue';

const store = useBaziStore();

const tgdz_relation = computed(() => ({
  tg: WuXing.getTgRelation(store.pillarShowData.map((i) => i.tg)),
  dz: WuXing.getDzRelation(store.pillarShowData.map((i) => i.dz)),
}));

const dialogVisible = ref(false);

const getRelationIndex = (relation: { index: number[]; start: number }, j: number) => {
  return relation.index.findIndex((z: number) => z === j + relation.start);
};
</script>

<style lang="scss" scoped>
.tgDzRelation {
  margin: 12px 0;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;

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
.tgdz-modal {
  padding: 1em 0.5em;
  width: 80%;
  max-height: 95%;
  text-align: left;

  .title {
    margin-bottom: 0;
    color: #000;
    font-weight: bold;
  }

  .scroll-content {
    max-height: 260px;
    overflow: scroll;
    padding: 0 0.5em;
  }

  .subheading {
    font-size: 16px;
    color: #9f9f9f;
    text-align: center;
  }
  .relationItemRow {
    background-color: #fff;
  }
  .relationText {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    z-index: 10;
    white-space: nowrap;
  }
  .relationItem {
    font-size: 16px;
    color: #000;
    background-color: #fff;
    text-align: center;
  }
  .lineBg {
    position: relative;
  }
  .line {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;
    background-color: var(--van-primary-color);
  }
  .leftRightLine {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
