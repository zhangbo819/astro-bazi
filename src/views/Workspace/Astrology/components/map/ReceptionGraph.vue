<template>
  <div ref="refMap" style="min-height: 350px; width: 100%; margin: auto" />
</template>

<script lang="ts" setup>
import { useAstroStore } from '@/store/astro';
import { planentsMap } from '@/utils/astro/astroUI';
import { ClassicalPlanent, Planent } from '@/utils/astro/constant';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const store = useAstroStore();

const refMap = ref();
let myChart: any;

const init = () => {
  //   console.log('planetReception', store.planetReception);
  const links = store.planetReception.reduce(
    (r: { source: number; target: number; lineStyle?: any }[], item) => {
      const from = ClassicalPlanent.findIndex((p) => p === String(item.from));
      const to = ClassicalPlanent.findIndex((p) => p === String(item.to));

      r.push({
        source: from,
        target: to,
        lineStyle: {
          color: item.type === 'Reception' ? '#000' : '#67c23a',
        },
      });

      if (item.type === 'MutualReception' || item.type === 'MutualWithReception') {
        r.push({
          source: to,
          target: from,
          lineStyle: {
            color: '#67c23a',
          },
        });
      }

      return r;
    },
    []
  );

  const option = {
    // title: {
    //   text: 'Basic Graph',
    // },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        // roam: true,
        label: {
          show: true,
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20,
        },
        data: [
          { name: Planent.Sun, x: 500, y: 100 },
          { name: Planent.Moon, x: 813, y: 249 },
          { name: Planent.Mercury, x: 891, y: 589 },
          { name: Planent.Venus, x: 674, y: 860 },
          { name: Planent.Mars, x: 326, y: 860 },
          { name: Planent.Jupiter, x: 109, y: 589 },
          { name: Planent.Saturn, x: 187, y: 249 },
        ].map((item: any, index) => {
          item.name = planentsMap[ClassicalPlanent[index]].name;
          return item;
        }),

        // links: [
        //   {
        //     source: 0,
        //     target: 1,
        //     // symbolSize: [5, 20],
        //     // label: {
        //     //   show: true,
        //     // },
        //     // lineStyle: {
        //     //   width: 5,
        //     //   curveness: 0.2,
        //     //   color: 'red',
        //     // },
        //   },
        //   {
        //     source: 2,
        //     target: 6,
        //   },
        // ],
        links,
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0,
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
  () => store.planetReception,
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
