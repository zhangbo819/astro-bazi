<template>
  <table class="table">
    <thead class="thead">
      <tr>
        <th
          v-for="i in showConfig"
          :key="i.title"
          :class="{ sortTh: i.sort }"
          @click="handleTitle(i, i.key)"
        >
          {{ i.title }}
          <template v-if="i.sort">
            <template v-if="activeKey === i.key">
              <van-icon v-if="isSortUp" name="arrow-up" class="sortIcon" />
              <van-icon v-else name="arrow-down" class="sortIcon" />
            </template>
            <van-icon v-else name="minus" class="sortIcon" />
          </template>
        </th>
      </tr>
    </thead>
    <tbody class="tbody">
      <tr v-for="item in sortData" :key="'simple' + item.name">
        <!-- v-if="item[j.key]" -->
        <td v-for="j in showConfig" :key="j.key + item[j.key]">
          <span
            v-if="j.key === 'compare_index' && item[j.key]"
            :class="{
              up: item[j.key].includes('↑') || item[j.key].endsWith('(新)'),
              down: item[j.key].includes('↓'),
            }"
          >
            {{ item[j.key] }}
          </span>
          <span v-else>
            {{ item[j.key] || "-" }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// import { Icon as VanIcon } from "vant";

const props = defineProps<{ config: any[]; data: any[] }>();
// const emit = defineEmits();

const activeKey = ref<string | null>(null);
const isSortUp = ref(true);

const showConfig = computed(() => {
  return props.config.filter((i) => !i.hidden);
});
const sortData = computed(() => {
  if (activeKey.value === null) return props.data;

  const targetConfigItem = props.config.find((i) => i.key === activeKey.value);
  if (!targetConfigItem) return props.data;

  const { sortFn = null, sortFormatter = (v: string) => v } = targetConfigItem;

  const newData = props.data.map((i) => i);

  const activeKeyValue = activeKey.value;

  newData.sort((a, b) =>
    sortFn
      ? sortFn(a, b, isSortUp.value)
      : isSortUp.value
      ? sortFormatter(a[activeKeyValue]) - sortFormatter(b[activeKeyValue])
      : sortFormatter(b[activeKeyValue]) - sortFormatter(a[activeKeyValue])
  );

  // console.log("newData", newData);

  return newData;
});

const handleTitle = (i: any, key: string) => {
  if (!i.sort) return;
  // console.log("key", key);
  if (activeKey.value !== key) {
    activeKey.value = key;
    isSortUp.value = true;
  } else if (isSortUp.value) {
    isSortUp.value = !isSortUp.value;
  } else {
    activeKey.value = null;
  }

  // console.log("activeKey", activeKey.value);
  // console.log("isSortUp", isSortUp.value);
};
</script>

<style lang="scss" scoped>
.simpleTable {
  margin: 0 auto;
}
.table {
  border-spacing: 8px;
  // border-collapse: collapse;
}
.thead {
  white-space: nowrap;

  .sortTh {
    cursor: pointer;
  }
  .sortIcon {
    font-size: 12px;
    transform: scale(0.8);
  }
}
.tbody tr {
  // margin: 8px 0;
  vertical-align: top;
}
.up {
  color: #ee0a23;
}

.down {
  color: #3bc160;
}
</style>
