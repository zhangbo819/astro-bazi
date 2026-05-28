<template>
  <div ref="refMap" style="min-height: 550px; width: 100%; margin: auto"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';

const props = defineProps<{ data: ChinaData[] }>();

watch(
  () => props.data,
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

const refMap = ref();
let myChart: any;
const init = () => {
  console.log('data', props.data);
  const companyList = props.data
    .reduce((r, i) => {
      i.children.forEach((j) => {
        j.children.forEach((k) => {
          r.push(k);
        });
      });
      return r;
    }, [] as ChinaDataItem[])
    .sort((a, b) => Number(a.index) - Number(b.index))
    .slice(0, 20);

  //   console.log("companyList", companyList);

  const option = {
    title: { text: '前20公司' },
    // xAxis: {
    //   type: "category",
    //   data: companyList.map(item => item.name),
    //   axisTick: {
    //     alignWithLabel: true
    //   },
    // },
    // yAxis: {
    //   name: "营收(万元)",
    //   type: "value"
    // },

    dataset: [
      {
        dimensions: ['name', 'revenue', 'profession', 'index'],
        source: companyList.map((i) => [
          i.name.replace(/(股份)?有限公司/, ''),
          i.revenue,
          i.address,
          i.index,
        ]),
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: 'index', order: 'asc' },
        },
      },
    ],
    xAxis: {
      type: 'category',
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: {
      name: '营收(万元)',
    },
    series: {
      type: 'bar',
      encode: { x: 'name', y: 'score' },
      datasetIndex: 1,
    },

    // series: [
    //   {
    //     // data: companyList.map(i => i.revenue),
    //     type: "bar",
    //     showBackground: true,
    //     backgroundStyle: {
    //       color: "rgba(180, 180, 180, 0.2)"
    //     }
    //   }
    // ],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
  };

  myChart = window.echarts.init(refMap.value);
  myChart.setOption(option);
};
const resize = () => {
  if (myChart && myChart.resize) {
    myChart.resize();
  }
};
</script>

<style lang="scss" scoped></style>
