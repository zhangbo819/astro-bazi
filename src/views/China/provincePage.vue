<template>
  <div class="province">
    <header>
      <div @click="goBack()">返回</div>
      <div v-if="provinceData" class="all" @click="handleAll">
        {{ `${$route.query.province} 总 ${provinceData.count} 个` }}
      </div>
    </header>

    <div :id="id" class="o-echarts"></div>

    <CityList :province-data="showList" is-details />

    <!-- <div v-for="(item, index) in showList" :key="item.name || index">
      <span>{{ index + 1 }}. {{ item.name }} 排名 {{ item.index }}</span>
      <p>营收{{ item.revenue }} 万元 总部地址 {{ item.address }}</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import CityList from '@/components/CityList.vue';
import { getYearData } from '@/utils/China';
import { getProvinceData } from '@/utils/省份数据/json(省份)';

const route = useRoute();

const id = 'echarts_' + new Date().getTime();

const option = ref({
  title: {
    text: '',
    top: '8%',
    left: '8%',
    textStyle: {
      fontSize: 14,
      fontWeight: 300,
      color: '#b6d7ff',
    },
  },
  tooltip: {
    padding: 0,
    //   backgroundColor: "transparent",
    // 数据格式化
    formatter: function (params: any, callback: any) {
      return params.name + '：' + params.value;
    },
  },
  legend: {
    orient: 'vertical',
    top: '9%',
    left: '5%',
    icon: 'circle',
    data: [],
    selectedMode: 'single',
    selected: {},
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 30,
    inactiveColor: '#b6d7ff',
    textStyle: {
      color: '#ec808d',
      fontSize: 14,
      fontWeight: 300,
      padding: [0, 0, 0, 15],
    },
  },
  visualMap: {
    min: 0,
    max: 80,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'], // 取值范围的文字
    inRange: {
      color: ['#e0ffff', 'blue'], // 取值范围的颜色
    },
    show: true, // 图注
  },
  geo: {
    map: '',
    roam: false, // 不开启缩放和平移
    zoom: 1, // 视角缩放比例
    label: {
      normal: {
        show: true,
        fontSize: 10,
        color: '#000',
      },
      emphasis: {
        show: true,
        color: 'blue',
      },
    },
    itemStyle: {
      normal: {
        borderColor: 'rgba(0, 0, 0, 0.2)',
      },
      emphasis: {
        areaColor: 'skyblue', // 鼠标选择区域颜色
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 20,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    left: '5%',
    right: '5%',
    top: '5%',
    bottom: '5%',
  },
  series: [
    {
      name: '年度总项目数据查询',
      type: 'map',
      geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
      data: [],
    },
  ],
  provinceJSON: {},
  provinceName: '',
});
const showList = ref<any>(null);

const currentData = ref<any[]>([]);
watch(
  () => route.query.year,
  async () => {
    currentData.value = (await getYearData(route.query.year as string)) || [];
  },
  { immediate: true }
);
const provinceData = computed(() => {
  return currentData.value.find((item) => item.name.includes(route.query.province));
});

watch(
  () => provinceData.value,
  () => renderMap()
);

onMounted(() => {
  window.addEventListener('resize', resize);
  renderMap();
  handleAll();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});

let echartObj: any = null;
const renderMap = async () => {
  const provinceName = route.query.provinceName;
  const province = route.query.province;
  // this.provinceName = provinceName;
  const provinceJSON = getProvinceData(provinceName as string);

  option.value.geo.map = province as string;
  option.value.series[0].data = currentData.value
    .find((item) => item.name.includes(route.query.province))
    .children.map((i: any) => ({ name: i.name, value: i.count }));
  echartObj = window.echarts.init(document.getElementById(id));
  window.echarts.registerMap(province, provinceJSON);
  // console.log("this.option", this.option);
  echartObj.setOption(option.value);

  echartObj.on('click', (params: any) => {
    console.log('params', params.name);
    // console.log("", this.provinceData);
    const target = provinceData.value.children.filter((i: any) => i.name.includes(params.name));
    console.log('target', target);
    if (target) {
      showList.value = {
        count: provinceData.value.count,
        name: provinceData.value.name,
        children: target,
      };
    } else {
      showList.value = [];
    }
  });
};
const goBack = () => {
  router.go(-1);
};
const resize = () => {
  if (echartObj && echartObj.resize) {
    echartObj.resize();
  }
};
const handleAll = () => {
  console.log('this.provinceData', provinceData.value);
  showList.value = provinceData.value;
};
</script>

<style lang="scss">
.province {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="scss">
.o-echarts {
  min-height: 550px;
  width: 100%;
  margin: auto;
}
</style>
<style lang="scss" scoped>
.all {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>
