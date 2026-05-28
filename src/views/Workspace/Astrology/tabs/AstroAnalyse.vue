<template>
  <div>
    <!-- Analyse -->
    <div ref="refMap" style="min-height: 350px; width: 100%; margin: auto" />
  </div>

  <div>
    <h2>合相群</h2>
    <p v-for="(item, index) in store.conjunctionGroups" :key="index">
      合相群{{ index + 1 }}:
      <span
        v-for="p in item.planets"
        :key="p"
        :style="{ color: planentsMap[p].color, marginRight: '8px' }"
        >{{ planentsMap[p].name }}</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAstroStore } from '@/store/astro';
import { AstroElementMap, AstroModalityMap, planentsMap } from '@/utils/astro/astroUI';
import { ASTRO_ELEMENTS, ASTRO_MODALITIES } from '@/utils/astro/constant';
import { AstroDistribution, buildDistribution } from '@/utils/astro/planets';

const store = useAstroStore();

function toElementRadarData(distribution: AstroDistribution) {
  return ASTRO_ELEMENTS.map((e) => distribution.element[e].length);
}

function toModalityRadarData(distribution: AstroDistribution) {
  return ASTRO_MODALITIES.map((m) => distribution.modality[m].length);
}

function getRadarMax(values: number[]) {
  const max = Math.max(...values);

  return Math.ceil((max + 1) / 2) * 2;
}

const refMap = ref();
let myChart: any;
const init = () => {
  const distribution = buildDistribution(store.planetList);
  const elementValue = toElementRadarData(distribution);
  const modalityValue = toModalityRadarData(distribution);
  const max_4 = getRadarMax(elementValue);
  const max_3 = getRadarMax(modalityValue);
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
    },

    legend: {
      left: 'center',
      data: ['四元素', '三模式'],
    },

    title: [
      {
        text: '四元素',
        left: '25%',
        top: 10,
        textAlign: 'center',
      },

      {
        text: '三模式',
        left: '75%',
        top: 10,
        textAlign: 'center',
      },
    ],

    radar: [
      // 四元素
      {
        center: ['25%', '58%'],

        radius: 90,

        splitNumber: 5,

        shape: 'polygon',

        indicator: [
          { name: '火', max: max_4 },
          { name: '土', max: max_4 },
          { name: '风', max: max_4 },
          { name: '水', max: max_4 },
        ],

        // splitLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255, 0.08)',
        //   },
        // },

        // splitArea: {
        //   areaStyle: {
        //     color: ['rgba(255,255,255,0.015)', 'rgba(255,255,255,0.025)'],
        //   },
        // },

        // 中间x y 轴的线
        // axisLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.12)',
        //   },
        // },
      },

      // 三模式
      {
        center: ['75%', '58%'],

        radius: 90,

        splitNumber: 5,

        shape: 'polygon',

        indicator: [
          { name: '开创', max: max_3 },
          { name: '固定', max: max_3 },
          { name: '变动', max: max_3 },
        ],

        // splitLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.08)',
        //   },
        // },

        // splitArea: {
        //   areaStyle: {
        //     color: ['rgba(255,255,255,0.015)', 'rgba(255,255,255,0.025)'],
        //   },
        // },

        // axisLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.12)',
        //   },
        // },
      },
    ],

    series: [
      // 四元素
      {
        type: 'radar',

        radarIndex: 0,

        symbol: 'circle',

        symbolSize: 6,

        lineStyle: {
          width: 3,
          color: '#ff9666', // 围起来的颜色
          //   color: 'red', // 围起来的线的颜色
        },

        itemStyle: {
          color: '#ff9666', // 围起来的颜色
        },

        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255,170,120,0.42)',
              },
              {
                offset: 1,
                color: 'rgba(255,120,80,0.12)',
              },
            ],
          },
        },

        emphasis: {
          lineStyle: {
            width: 4,
          },
        },

        data: [
          {
            name: '四元素',

            value: elementValue,
          },
        ],

        tooltip: {
          trigger: 'item',

          formatter(params: any) {
            // console.log(params);

            const values = params.value;

            return ASTRO_ELEMENTS.map((key, index) => {
              const planets = distribution.element[key].map(
                (p) => `<span style="color: ${planentsMap[p].color}">${planentsMap[p].name}</span>`
              );

              return `
          <div style="
            margin-bottom:0px;
          ">
            <div>
              <b style="color: ${AstroElementMap[key].color}">${AstroElementMap[key].name}</b>
              (${values[index]})
            </div>

            <div style="
              opacity:0.8;
              font-size:12px;
            ">
              ${planets.join(' · ')}
            </div>
          </div>
        `;
            }).join('');
          },
        },
      },

      // 三模式
      {
        type: 'radar',

        radarIndex: 1,

        symbol: 'circle',

        symbolSize: 6,

        lineStyle: {
          width: 2,
          color: '#8ea8ff',
        },

        itemStyle: {
          color: '#8ea8ff',
        },

        areaStyle: {
          color: {
            type: 'radial',

            x: 0.5,
            y: 0.5,
            r: 1,

            colorStops: [
              {
                offset: 0,
                color: 'rgba(160,180,255,0.36)',
              },

              {
                offset: 1,
                color: 'rgba(120,140,255,0.10)',
              },
            ],
          },
        },

        emphasis: {
          lineStyle: {
            width: 3,
          },
        },

        data: [
          {
            name: '三模式',

            value: modalityValue,
          },
        ],

        tooltip: {
          trigger: 'item',

          formatter(params: any) {
            // console.log(params);

            const values = params.value;

            return ASTRO_MODALITIES.map((key, index) => {
              const planets = distribution.modality[key].map(
                (p) => `<span style="color: ${planentsMap[p].color}">${planentsMap[p].name}</span>`
              );

              return `
          <div style="
            margin-bottom:0px;
          ">
            <div>
              <b>${AstroModalityMap[key].name}</b>
              (${values[index]})
            </div>

            <div style="
              opacity:0.8;
              font-size:12px;
            ">
              ${planets.join(' · ')}
            </div>
          </div>
        `;
            }).join('');
          },
        },
      },
    ],
  };

  myChart = window.echarts.init(refMap.value);
  myChart.setOption(option);
};
const resize = () => {
  if (myChart && myChart.resize) {
    myChart.resize();
  }
};

watch(
  () => store.planetList,
  () => {
    init();
  }
);
onMounted(() => {
  window.addEventListener('resize', resize);
  init();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
</script>
