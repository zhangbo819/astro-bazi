<template>
  <div class="world">
    <nav>
      <router-link to="/china">中国</router-link> | <router-link to="/world">世界</router-link>
    </nav>

    <YearHeader v-model="currentYear" :year-list="supportList" />

    <div class="radios">
      <van-radio-group v-model="form.type" direction="horizontal">
        <van-radio :name="enumTypes.index">按排名</van-radio>
        <van-radio :name="enumTypes.country">按国家</van-radio>
        <van-radio :name="enumTypes.industry">按行业</van-radio>
      </van-radio-group>

      <van-radio-group
        v-if="supportList.includes(currentYear - 1)"
        v-model="form.compare"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <van-radio name="0">正常</van-radio>
        <van-radio name="1">与去年对比</van-radio>
      </van-radio-group>

      <van-radio-group v-model="form.isAll" direction="horizontal" style="margin-top: 12px">
        <van-radio name="0">精简版</van-radio>
        <van-radio name="1">完整版</van-radio>
      </van-radio-group>

      <!-- 列表项 -->
      <van-checkbox-group
        v-model="form.layout"
        direction="horizontal"
        style="margin-top: 12px; justify-content: center"
      >
        <van-checkbox
          v-for="item in showConfig"
          :key="item.key"
          :name="item.key"
          :disabled="form.layout.length === 1 && form.layout[0] === item.key"
          >{{ item.title }}</van-checkbox
        >
      </van-checkbox-group>

      <p><i>单位: 百万美元</i></p>
    </div>

    <!-- 按国家 -->
    <template v-if="form.type === enumTypes.country">
      <!-- <nav class="navList">
        <span v-for="item in countryData" :key="'nav'+ item.name">
          {{ `${item.name}` }}
        </span>
      </nav> -->
      <div v-for="item in countryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable class="simpleTable" :config="configs" :data="item.children" />
      </div>
    </template>

    <!-- 按行业 -->
    <template v-else-if="form.type === enumTypes.industry">
      <div v-for="item in industryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable class="simpleTable" :config="configs" :data="item.children" />
      </div>
    </template>

    <!-- 按排名 -->
    <template v-else-if="form.type === enumTypes.index">
      <h3>{{ `${currentYear}年排名` }}</h3>
      <MyTable class="simpleTable" :config="configs" :data="currentData" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import YearHeader from '@/components/YearHeader.vue';
import MyTable from '@/components/MyTable.vue';
import { getWorldYearData } from '@/utils/world';
import { sortByZhKey } from '../../utils/util';

const layout = [
  { title: '排名', key: 'index', sort: true },
  {
    title: '名次',
    key: 'compare_index',
    sort: true,
    sortFormatter: (v: string) => v.replace(/ \((.+?)\)/, ''),
  },
  { title: '简称', key: 'simpleName' }, // 简称
  { title: '名称', key: 'name' },
  {
    title: '行业',
    key: 'industry',
    sort: true,
    sortFn: sortByZhKey('industry'),
  },
  {
    title: '国家',
    key: 'country',
    sort: true,
    sortFn: sortByZhKey('country'),
  },
  {
    title: '营收',
    key: 'revenue',
    sort: true,
    sortFormatter: (v: string) => v.replace(',', ''),
  },
  {
    title: '净利润',
    key: 'profit',
    sort: true,
    sortFormatter: (v: string) => v.replace(',', ''),
  },
  {
    title: '利润率',
    key: 'profitMargin',
    sort: true,
    sortFormatter: (v: string) => v.replace('%', ''),
  },
];
function getLayout(targets: string[]) {
  return targets.map((key) => {
    return layout.find((i) => i.key === key);
  });
}
const enumTypes = {
  country: '1',
  industry: '2',
  index: '3',
};

const currentYear = ref(2023);
// const currentYear = ref(new Date().getFullYear());
const supportList = ref([2020, 2021, 2022, 2023]);
const form = ref({
  layout: ['index', 'simpleName', 'industry'],
  type: enumTypes.country, // enumTypes
  isAll: '0', //  0 精简 1 完整
  compare: '0', // 0 正常 1 和去年对比
});
const showConfig = ref([...layout]);

const currentData = ref<WorldItem[]>([]);
watch(
  () => currentYear.value,
  async () => {
    const data = (await getWorldYearData(currentYear.value)) || [];
    data.forEach((i) => {
      i.simpleName = i.name.replace(
        /(集团)?(有限公司|股份有限公司|控股有限公司|有限责任公司|总公司|公司|集团)$/,
        ''
      );
      let { revenue = '0', profit = '0' } = i;
      if (revenue && profit) {
        revenue = revenue.replace(/,/g, '');
        profit = profit.replace(/,/g, '');
        i.profitMargin = ((Number(profit) / Number(revenue)) * 100).toFixed(2) + '%';
      }
      return i;
    });
    currentData.value = data;
  },
  { immediate: true }
);

// 按国家分类
const countryData = ref<WorldClass[]>([]);
watch([() => currentYear.value, () => currentData.value], async () => {
  const data = currentData.value
    .reduce((r, i) => {
      const target = r.find((j) => j.name === i.country);
      if (!target) {
        r.push({ name: i.country, count: 0, children: [i] });
      } else {
        target.children.push(i);
      }

      return r;
    }, [] as WorldClass[])
    .map((i) => {
      i.count = i.children.length;
      return i;
    })
    .sort((a, b) => b.count - a.count);

  //   console.log("countryData", data);

  countryData.value = data;
});
// 按行业分类
const industryData = ref<WorldClass[]>([]);
watch([() => currentYear.value, () => currentData.value], async () => {
  industryData.value = currentData.value
    .reduce((r, i) => {
      const target = r.find((j) => j.name === i.industry);
      if (target) {
        target.children.push(i);
      } else {
        r.push({ name: i.industry, count: 1, children: [i] });
      }
      return r;
    }, [] as { name: string; count: number; children: WorldItem[] }[])
    .map((i) => {
      i.count = i.children.length;
      return i;
    })
    .sort((a, b) => b.count - a.count);
});

const genConfig = computed(() => {
  let res: string[] = [];
  const { type, compare } = form.value;

  const indexKey = compare === '0' ? 'index' : 'compare_index';
  const isAll = form.value.isAll === '0';

  switch (type) {
    case enumTypes.country: {
      res = isAll
        ? [indexKey, 'simpleName', 'industry']
        : [indexKey, 'simpleName', 'industry', 'revenue', 'profit', 'profitMargin'];
      break;
    }
    case enumTypes.industry:
    case enumTypes.index: {
      res = isAll
        ? [indexKey, 'country', 'simpleName']
        : [indexKey, 'simpleName', 'country', 'revenue', 'profit', 'profitMargin'];
      break;
    }
  }

  // if (this.currentYear === 2023) {
  //   // 2023 暂时没有利润 利润率
  //   res = res.filter(i => !["profit", "profitMargin"].includes(i));
  // }

  return res;
});

const configs = computed(() => getLayout(form.value.layout));

watch(
  () => genConfig.value,
  (val) => {
    form.value.layout = val;
  }
);

watch(
  () => currentYear.value,
  () => {
    form.value.compare = '0';
  },
  { immediate: true }
);

// 对比功能
watch(
  () => form.value.compare,
  async (val) => {
    // const compare_keys = ["index"];
    if (val === '1') {
      const previousYear = currentYear.value - 1;
      const previousData = await getWorldYearData(previousYear);

      currentData.value.forEach((item) => {
        if (typeof item.compare_index === 'undefined') {
          const target = previousData.find((j) => j.name === item.name);
          let text;
          if (target) {
            const compareNumber = Number(target.index) - Number(item.index);
            text =
              compareNumber === 0
                ? '-0'
                : compareNumber > 0
                ? `↑${compareNumber}`
                : `↓${Math.abs(compareNumber)}`;
          } else {
            text = '新';
          }
          item.compare_index = `${item.index} (${text})`;
        }
      });
      // console.log("this.currentData", this.currentData);
    }
  }
);
</script>

<style lang="scss">
.world {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="scss" scoped>
.radios {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.navList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  > span {
    display: inline-block;
    margin: 0 8px;
  }
}
</style>
