<template>
  <div ref="refMap" style="min-height: 350px; width: 100%; margin: auto" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAstroStore } from '@/store/astro';
import { planentsMap } from '@/utils/astro/astroUI';
import { ClassicalPlanent, Planent } from '@/utils/astro/constant';

const store = useAstroStore();

const refMap = ref();
let myChart: any;

const init = () => {
  //   console.log('planetReception', store.planetReception);
  const links = store.planetList.reduce(
    (r: { source: number; target: number; lineStyle?: any }[], item) => {
      const from = ClassicalPlanent.findIndex((p) => p === String(item.name));
      const to = ClassicalPlanent.findIndex((p) => p === String(item.bound));

      r.push({
        source: from,
        target: to,
      });

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
        // TODO 引入三王星
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
          item.itemStyle = {
            color: planentsMap[ClassicalPlanent[index]].color,
          };
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
          color: '#000',
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
