<template>
  <!-- 星座盘 -->
  <astro-round-plate :data="store.planetList" />

  <van-collapse v-model="activeTab">
    <!-- 操作栏 -->
    <!-- <van-collapse-item name="5">
        <template #title> <h2>操作栏</h2></template>
        <astro-operation v-model:time="time" />
      </van-collapse-item> -->

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

          <p class="value" :style="{ color: map12[item.sign].color }">
            {{ item.sign }} {{ map12[item.sign].name }}
            <span v-if="item.retrograde">R</span>
          </p>

          <p class="value">{{ item.degree }}°</p>
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
              <span :style="{ color: planentsMap[item.between[0]].color }"
                >{{ planentsMap[item.between[0]].symbol }}
                {{ planentsMap[item.between[0]].name }}</span
              >
              <span class="mid-span" :style="{ color: aspectPosition.map[item.type].color }">
                {{ aspectPosition.map[item.type].name }} {{ aspectPosition.map[item.type].symbol }}
              </span>
              <span :style="{ color: planentsMap[item.between[1]].color }"
                >{{ planentsMap[item.between[1]].name }}
                {{ planentsMap[item.between[1]].symbol }}</span
              >
            </p>
          </template>
          <!-- <template #label>
            <p>
              {{ item.between[0] }}
              <span class="mid-span" :style="{ color: aspectPosition.map[item.type].color }">
                {{ item.type }}
              </span>
              {{ item.between[1] }}
            </p>
          </template> -->
          <!-- <p class="value" :style="{ color: aspectPosition.map[item.type].color }">
            {{ item.type }} {{ aspectPosition.map[item.type].name }}
          </p> -->
          <p
            class="value"
            :style="{
              fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
            }"
          >
            {{ item.strength }} ({{ item.orb }}°)
          </p>
          <template v-if="item.window">
            <p class="value">
              开始时间 {{ item.window.start.toLocaleDateString() }}
              {{ item.window.start.getHours() }}:{{ item.window.start.getMinutes() }}
            </p>
            <p class="value">
              力量最强 {{ item.window.exact.toLocaleDateString() }}
              {{ item.window.exact.getHours() }}:{{ item.window.exact.getMinutes() }}
            </p>
            <p class="value">
              结束时间 {{ item.window.end.toLocaleDateString() }}
              {{ item.window.end.getHours() }}:{{ item.window.end.getMinutes() }}
            </p>
            <!-- <p class="value">计算耗时 {{ item.window._t }} ms</p> -->
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
import { DignityMap, map12, patternMap, planentsMap } from '@/utils/astro/astroUI';
import AstroRoundPlate from '../components/AstroRoundPlate.vue';

const store = useAstroStore();

const activeTab = ref(new Array(6).fill(0).map((_, i) => String(i + 1)));
</script>

<style lang="scss" scoped>
.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}
.mid-span {
  margin: 0 8px;
  font-size: small;
}
</style>
