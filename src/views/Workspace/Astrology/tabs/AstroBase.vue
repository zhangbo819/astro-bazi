<template>
  <!-- 星座盘 -->
  <astro-round-plate :data="store.planetList" :aspectData="store.aspectData" :time="store.time" />

  <van-collapse v-model="activeTab">
    <!-- 操作栏 -->
    <!-- <van-collapse-item name="5">
      <template #title> <h2>操作栏</h2></template>
      <astro-operation v-model:time="store.time" />
    </van-collapse-item> -->
    <van-cell-group inset>
      <van-cell title="时间" :value="store.time.toLocaleString()" />
    </van-cell-group>

    <!-- 格局 -->
    <van-collapse-item v-if="store.patternData.length" name="1">
      <template #title> <h2 style="color: #f00">格局</h2></template>
      <van-cell-group inset>
        <van-cell
          v-for="item in store.patternData"
          :key="item.type + item.planets"
          :label="item.type"
        >
          <template #title>
            <p>
              <span :style="{ color: patternMap[item.type].color }"
                >{{ patternMap[item.type].text
                }}{{ store.patternData.length <= 1 ? '格局' : '' }}</span
              >
            </p>
          </template>
          <p :style="{ color: patternMap[item.type].color }">{{ patternMap[item.type].desc }}</p>
          <p class="value">
            参与行星
            <span
              v-for="(p, index) in item.planets"
              :key="p"
              :style="{
                color: planentsMap[p].color,
                display: 'inline-block',
                marginLeft: '2px',
              }"
            >
              <template v-if="index !== 0">|</template>
              {{ planentsMap[p].name }}
            </span>
          </p>
        </van-cell>
      </van-cell-group>
    </van-collapse-item>

    <!-- 参数详情列表 -->
    <van-collapse-item name="2">
      <template #title>
        <h2>参数详情列表</h2>
      </template>
      <van-cell-group inset>
        <van-cell
          v-for="item in store.planetList"
          :key="item.name"
          :title="`${item.name} ${planentsMap[item.name].name} ${planentsMap[item.name].symbol}`"
          :title-style="{ color: planentsMap[item.name].color }"
        >
          <template #label>
            <span :style="{ color: DignityMap[item.dignity].color }">{{
              DignityMap[item.dignity].text
            }}</span>
          </template>

          <sign-text class="value" :name="item.sign">
            <template #prev>{{ item.sign + ' ' }}</template>
            <span v-if="item.retrograde">R</span>
          </sign-text>
          <p class="value">{{ item.degree }}°</p>
          <!-- <p class="bound" v-if="item.bound">
            界限：<span :style="{ color: planentsMap[item.bound].color }">{{
              planentsMap[item.bound].name
            }}</span>
            <span v-if="String(item.name) === item.bound" style="color: #67c23a"> (本位)</span>
          </p> -->
        </van-cell>
      </van-cell-group>
    </van-collapse-item>

    <!-- 相位 -->
    <van-collapse-item name="3">
      <template #title> <h2>主要相位</h2></template>
      <van-cell-group inset>
        <van-cell v-for="item in store.aspectData" :key="item.between.join('.')">
          <template #title>
            <p>
              <planet-text :name="item.between[0]">
                <template #prev>{{ planentsMap[item.between[0]].symbol + ' ' }}</template>
              </planet-text>
              <span class="mid-span" :style="{ color: aspectPosition.map[item.type].color }">
                {{ aspectPosition.map[item.type].name }} {{ aspectPosition.map[item.type].symbol }}
              </span>
              <planet-text :name="item.between[1]">
                {{ ' ' + planentsMap[item.between[1]].symbol }}
              </planet-text>
            </p>
          </template>
          <template #label>
            <p>
              {{ item.between[0] }}
              <span class="mid-span" :style="{ color: aspectPosition.map[item.type].color }">
                {{ item.type }}
              </span>
              {{ item.between[1] }}
            </p>
          </template>
          <p class="value" :style="{ color: aspectPosition.map[item.type].color }">
            {{ item.type }} {{ aspectPosition.map[item.type].name }} ({{
              item.aspectTrend === 'Applying' ? '入相' : '出相'
            }})
          </p>
          <p
            class="value"
            :style="{
              fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
            }"
          >
            <span>{{ item.strength }} ({{ item.orb }}°)</span>
          </p>
          <template v-if="item.window">
            <p class="value">
              <span
                >开始时间 {{ item.window.start.toLocaleDateString() }}
                {{ item.window.start.getHours() }}:{{ item.window.start.getMinutes() }}</span
              >
            </p>
            <p class="value">
              <span
                >力量最强 {{ item.window.exact.toLocaleDateString() }}
                {{ item.window.exact.getHours() }}:{{ item.window.exact.getMinutes() }}</span
              >
            </p>
            <p class="value">
              <span
                >结束时间 {{ item.window.end.toLocaleDateString() }}
                {{ item.window.end.getHours() }}:{{ item.window.end.getMinutes() }}</span
              >
            </p>
            <i class="value">计算耗时 {{ item.window._t }} ms</i>
          </template>
        </van-cell>
      </van-cell-group>
    </van-collapse-item>
  </van-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAstroStore } from '@/store/astro';
import { aspectPosition } from '@/utils/astro/planets';
import { DignityMap, patternMap, planentsMap } from '@/utils/astro/astroUI';
import AstroRoundPlate from '../components/AstroRoundPlate.vue';
import PlanetText from '../components/PlanetText.vue';
import SignText from '../components/SignText.vue';
import AstroOperation from '../components/AstroOperation.vue';

const store = useAstroStore();

const activeTab = ref(new Array(6).fill(0).map((_, i) => String(i + 1)));
</script>

<style lang="scss" scoped>
.value {
  // font-weight: bold;
  > span {
    color: #666;
  }
}
.bound {
  font-size: 12px;
}
.mid-span {
  margin: 0 8px;
  font-size: small;
}
</style>
