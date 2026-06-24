<template>
  <div>
    <Elem4Moda3 />
  </div>

  <div class="content">
    <h2>合相群</h2>
    <p v-for="(item, index) in store.conjunctionGroups" :key="index">
      合相群{{ index + 1 }}:
      <PlanetText v-for="p in item.planets" :key="p" :style="{ marginRight: '8px' }" :name="p" />
    </p>
  </div>

  <div class="content">
    <h2>星群</h2>
    <div v-for="item in store.stellium" :key="item.name">
      <SignText :name="item.name"> <template #prev>群星</template> </SignText>：
      <PlanetText
        v-for="p in item.data"
        :key="p.name"
        :name="p.name"
        :style="{ marginRight: '8px' }"
      />
    </div>
  </div>

  <Row class="content" style="justify-content: space-between">
    <div />
    <van-button
      type="primary"
      plain
      hairline
      @click="onClickInterPret"
      :loading="AIBtnLoading"
      loading-text="加载中..."
      >AI 解读整体</van-button
    >
  </Row>

  <div class="content">
    <h1>古典行星评分</h1>
    <h2>三分主星(标准多罗修斯)</h2>
    <Row style="align-items: center">
      <p style="margin-right: 8px">{{ isDay ? '日盘' : '夜盘' }}</p>
      <van-switch v-model="isDay" />
    </Row>
    <div v-for="item in triplicity" :key="item.name" class="chain">
      <PlanetText :style="{ marginRight: '8px' }" :name="item.name"
        >&nbsp;<SignText :name="item.sign" text-only
      /></PlanetText>
      <template v-if="item.tripliity">
        <span style="color: #67c23a"
          >三分权：{{ item.tripliity.ruler }}
          <template v-if="item.tripliity.index === 0">(+ 3)</template></span
        >
      </template>
      <span v-else style="color: gray">无三分权</span>
      <p>
        主星位置：
        <span
          v-for="(j, ruleIndex) in item.rule"
          :key="item.name + j"
          :style="{
            color: item.tripliity && ruleIndex === item.tripliity.index ? '#67c23a' : 'gray',
          }"
          >{{ planentsMap[j].name }}
          <!-- <span v-if="ruleIndex === item.tripliity.index">({{ item.tripliity.ruler }})</span> -->
        </span>
      </p>
      <van-divider style="--van-divider-margin: 8px" />
    </div>
  </div>

  <div class="content">
    <h2>界限图(埃及表)</h2>
    <h3>行星界限</h3>
    <p v-for="planet in store.planetList" :key="planet.name" class="chain">
      <PlanetText :name="planet.name">&nbsp;<SignText :name="planet.sign" text-only /></PlanetText>
      <span
        v-if="DignityMap[planet.dignity].text"
        :style="{ color: DignityMap[planet.dignity].color }"
        >({{ DignityMap[planet.dignity].text }} {{ DignityMap[planet.dignity].score }})
      </span>
      位于
      <PlanetText v-if="planet.bound" :name="planet.bound">界</PlanetText>
      <span v-if="String(planet.name) === planet.bound" style="color: #67c23a"> (本位 + 2)</span>
    </p>

    <h3>界限链路</h3>
    <p v-for="(chain, index) in bounds" :key="index" class="chain">
      <span v-for="(planet, j) in chain">
        <span v-if="j !== 0"> -> </span>
        <PlanetText v-if="planet" :name="planet" />
      </span>
    </p>
  </div>

  <div class="content">
    <h2>接纳与互溶</h2>

    <Row style="align-items: center">
      <p style="margin-right: 8px">{{ store.bothDomicile ? '守护和入旺' : '仅守护' }}</p>
      <van-switch v-model="store.bothDomicile" />
    </Row>

    <template v-if="store.planetReception.length">
      <p v-for="item in store.planetReception" :key="item.type + item.from + item.to">
        <span
          ><PlanetText :name="item.to">&nbsp;<SignText :name="item.toSign" text-only /></PlanetText>
          {{
            item.type === 'Reception'
              ? item.fromReceptionType === 'Domicile'
                ? '守护接纳'
                : '入旺接纳'
              : '与'
          }}
          <!--  -->
          <PlanetText :name="item.from"
            >&nbsp;<SignText :name="item.fromSign" text-only
          /></PlanetText>

          <sapn v-if="item.type !== 'Reception'" style="margin-left: 8px">
            <b>{{ item.type === 'MutualReception' ? '互溶' : '互溶接纳' }}</b>
            ({{ item.fromReceptionType === 'Domicile' ? '守护' : '入旺' }} +
            {{ item.toReceptionType === 'Domicile' ? '守护' : '入旺' }})
          </sapn>
        </span>
      </p>
      <p>
        两个星体同时接纳彼此则为互溶，互溶基础上产生相位则为互溶接纳。<i
          >效果：互溶接纳 > 互溶 > 接纳</i
        >
      </p>
      <p>
        互溶或接纳可以一定程度地增加行星的力量，搭配得当力量上甚至可以超越庙旺，但仍保留了落陷的戏剧性。
        <i>效果：守护接纳 > 入旺接纳 > 三分接纳 > 界接纳 > 面接纳</i>
      </p>
      <p><i>(此处仅展示守护和入旺互溶接纳)</i></p>
    </template>
    <p v-else>关系不存在</p>
  </div>
  <ReceptionGraph />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAstroStore } from '@/store/astro';
import { useAIStore } from '@/store/AI';
import Row from '@/components/Row.vue';
import { DignityMap, planentsMap } from '@/utils/astro/astroUI';
import { Planent } from '@/utils/astro/constant';
import { getBoundChains } from '@/utils/astro/bounds';
import { calcTriplicity } from '@/utils/astro/triplicity';
import PlanetText from '../components/PlanetText.vue';
import SignText from '../components/SignText.vue';
import ReceptionGraph from '../components/map/ReceptionGraph.vue';
import Elem4Moda3 from '../components/map/Elem4Moda3.vue';

const store = useAstroStore();

// ai 解读
const AIStore = useAIStore();
const AIBtnLoading = ref(false);
const onClickInterPret = async () => {
  // 简化参数
  const params = {
    planets: store.planetList.map(({ name, sign, retrograde, dignity }) => {
      let res = `${name}-${sign}`;
      if (retrograde) {
        res += '(R)';
      }
      if (dignity !== 'Peregrine') {
        res += `(${dignity})`;
      }
      return res;
    }),
    aspects: store.aspectData.map(({ between, type }) => `${between[0]} ${type} ${between[1]}`),
    pattern: store.patternData.map(({ slots, type }) => ({ slots, type })),
    conjunctionGroups: store.conjunctionGroups.map(({ planets }) => planets),
    stellium: store.stellium.map(({ name, data }) => ({ name, data: data.map((i) => i.name) })),
  };
  console.log('params', JSON.stringify(params));
  AIBtnLoading.value = true;
  await AIStore.apiGetInterPret(params);
  AIBtnLoading.value = false;
};

// 三分主星
const isDay = ref(true);
const triplicity = computed(() => {
  return calcTriplicity(store.planetList, isDay.value);
});

// 行星界限
const bounds = computed(() => {
  return getBoundChains(
    store.planetList.map((i) => ({
      planet: String(i.name) as Planent,
      bound: i.bound,
    }))
  );
});

// 行星状态
// const planetState = computed(() => {
//   return verifyBounds(store.planetList);
// });
// console.log(planetState.value);
</script>

<style lang="scss" scoped>
.content {
  padding: 1em;
}
.chain {
  margin: 5px 0;
}
</style>
