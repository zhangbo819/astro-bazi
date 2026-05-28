<template>
  <div v-if="provinceData">
    <p>{{ provinceData.name }} {{ provinceData.count }}</p>
    <div v-for="province in provinceData.children" :key="province.name">
      <p>{{ province.name || "未知" }} {{ province.count }}</p>
      <!-- <div v-for="city in province.children" :key="city.name">
        <span>第{{ city.index }}名 {{ city.name }} {{ city.count }}</span>
        <span v-if="isDetails">{{ city.address }}</span>
        <span>{{ city.revenue }}</span>
      </div> -->
      <MyTable class="simpleTable" :config="config" :data="province.children" />
    </div>
  </div>
  <div v-else>暂无数据</div>
</template>

<script setup lang="ts">
import MyTable from "@/components/MyTable.vue";
import { ref } from "vue";

const props = defineProps<{
  provinceData?: ChinaData;
  isDetails: boolean;
}>();
// const emit = defineEmits();

const config = ref(
  [
    { title: "排名", key: "index", sort: true },
    { title: "名称", key: "name" },
    props.isDetails && { title: "地址", key: "address" },
    { title: "营收", key: "revenue", sort: true },
  ].filter((i) => i)
);
</script>

<style lang="scss" scoped></style>
