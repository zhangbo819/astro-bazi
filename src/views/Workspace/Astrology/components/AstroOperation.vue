<template>
  <van-cell title="手动切换">
    <van-row>
      <van-col span="8" class="cursor" @click="onClickDay(-1)"
        ><van-icon name="arrow-left"
      /></van-col>
      <van-col span="8">{{ time.getDate() }} </van-col>
      <van-col span="8" class="cursor" @click="onClickDay(1)"><van-icon name="arrow" /></van-col>
    </van-row>
  </van-cell>
  <van-cell
    title="滑块组选择"
    :value="time.toLocaleString()"
    class="cursor"
    @click="showPickerGroup = true"
  />
  <van-popup v-model:show="showPickerGroup" position="bottom">
    <van-picker-group
      title="指定星盘日期"
      :tabs="['选择日期', '选择时间']"
      next-step-text="下一步"
      @confirm="onPickerGroupConfirm"
      @cancel="showPickerGroup = false"
    >
      <van-date-picker v-model="currentDate" :min-date="minDate" :max-date="maxDate" />
      <van-time-picker v-model="currentTime" :formatter="formatter" />
    </van-picker-group>
  </van-popup>
  <van-cell
    title="日历选择"
    :value="time.toLocaleString()"
    class="cursor"
    @click="showCalendar = true"
  />
  <van-calendar
    v-model:show="showCalendar"
    switch-mode="year-month"
    :default-date="time"
    @confirm="onCalendarConfirm"
  />
  <van-cell title="此时此刻" :value="time.toLocaleString()" class="cursor" @click="onClickTime" />
  <van-cell title="示例数据" is-link :value="''" @click="timeListShow = true" />
  <van-action-sheet v-model:show="timeListShow" :title="activeDescription || '请选择'">
    <van-tree-select
      v-model:active-id="activeId"
      v-model:main-active-index="activeIndex"
      :items="astrologyEventsUI"
      @click-item="clickItem"
    />
  </van-action-sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { astrologyEventsUI } from '@/utils/astro/astroDates';

const props = defineProps({
  time: {
    type: Date,
    required: true,
  },
});
const emit = defineEmits(['update:time']);

const now = new Date();
const minDate = new Date(1900, 0, 1); // 最小 1900 年
const maxDate = new Date(now.getFullYear() + 100, 11, 31); // 100 年后
const currentDate = ref([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
const currentTime = ref([now.getHours(), now.getMinutes()]);
const showPickerGroup = ref(false);

watch(
  () => props.time,
  (val) => {
    currentDate.value = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
    currentTime.value = [val.getHours(), val.getMinutes()];
  },
  { immediate: true }
);

const onClickTime = () => {
  emit('update:time', new Date());
  // showSuccessToast("设置成功");
};

const onClickDay = (step: number) => {
  const newDate = new Date(props.time);

  const day = newDate.getDate() + step;

  newDate.setDate(day);

  emit('update:time', newDate);
};

const showCalendar = ref(false);
const onCalendarConfirm = (value: Date) => {
  showCalendar.value = false;

  const newDate = new Date(props.time);

  newDate.setFullYear(value.getFullYear());
  newDate.setMonth(value.getMonth());
  newDate.setDate(value.getDate());

  emit('update:time', newDate);
};

const formatter = (type: string, option: any) => {
  if (type === 'hour') {
    option.text += '时';
  }
  if (type === 'minute') {
    option.text += '分';
  }
  return option;
};
const onPickerGroupConfirm = () => {
  const [year, month, day] = currentDate.value;
  const [hour, minute] = currentTime.value;

  const newDate = new Date(props.time);

  newDate.setFullYear(year);
  newDate.setMonth(month - 1);
  newDate.setDate(day);
  newDate.setHours(hour);
  newDate.setMinutes(minute);

  emit('update:time', newDate);
  showPickerGroup.value = false;
};

// const time = ref(new Date(2025, 7, 17)); // 1755356400000 俩风筝 俩三角 神秘矩形
// { name: 'Yod 上帝之指', time: '2017-06-05T04:00:00Z' },

const timeListShow = ref(false);
const activeId = ref();
const activeIndex = ref();
const activeDescription = ref('');
const clickItem = (item: Record<string, string>) => {
  // console.log(item);
  activeDescription.value = item.description;
  const newDate = new Date(item.id);
  emit('update:time', newDate);
  timeListShow.value = false;
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
