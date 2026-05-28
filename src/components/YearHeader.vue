<template>
  <header class="yearList">
    <p
      v-for="year in yearList"
      :key="year"
      :class="{ active: year === currentYear }"
      @click="handerYear(year)"
    >
      <!-- {{ year === new Date().getFullYear() ? year + "(未完)" : year }} -->
      {{ year }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ modelValue: number; yearList: number[] }>();
const emit = defineEmits(["update:modelValue"]);

const currentYear = ref(props.modelValue);

const handerYear = (year: number) => {
  currentYear.value = year;
  emit("update:modelValue", year);
};
</script>

<style lang="scss" scoped>
.yearList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    cursor: pointer;
    font-size: 18px;

    &.active {
      text-decoration-line: underline;
      color: #f008;
    }

    & + p {
      margin-left: 16px;
    }
  }
}
</style>
