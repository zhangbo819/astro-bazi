<template>
  <van-row align="center" justify="space-between" style="margin-top: 16px; padding: 8px">
    <van-col>
      <p>
        起运：出生后{{ store.paipanInfo.big.start_desc }}
        <span
          v-if="
            store.paipanInfo.big.data[activeDyIndex] &&
            store.paipanInfo.big.data[activeDyIndex].years[activeLnIndex]
          "
        >
          {{
            store.paipanInfo.big.data[activeDyIndex].years[activeLnIndex].year - store.paipanInfo.yy
          }}
          岁
        </span>
      </p>
    </van-col>
    <van-col>
      <span class="theme-btn" @click="handleClose">关闭</span>
      <span class="theme-btn" @click="handleNow">今</span>
    </van-col>
  </van-row>

  <!-- 大运 -->
  <div class="listCard">
    <div
      :class="[
        'listTilte',
        { active: store.pillarShowData.find((i) => i.title === PillarTitle.大运) },
      ]"
      @click="handleTriggerList(PillarTitle.大运)"
    >
      大<br />运
    </div>
    <div class="rowList">
      <div
        v-for="(item, index) in store.paipanInfo.big.data"
        :key="'dayun_' + item.name"
        :class="[
          'dayunItem',
          {
            active: activeDyIndex === index,
          },
        ]"
        @click="handleDyItem(index)"
      >
        <p class="itemText">
          {{ item.name === '小运' ? store.paipanInfo.yy : item.start_time[0] }}
        </p>
        <p class="itemText">
          {{
            item.name === '小运'
              ? `1 ~ ${item.years.length}`
              : item.start_time[0] - store.paipanInfo.yy + 1
          }}
          岁
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流年 -->
  <div v-if="store.paipanInfo.big.data[activeDyIndex]" class="listCard">
    <div
      :class="[
        'listTilte',
        { active: store.pillarShowData.find((i) => i.title === PillarTitle.流年) },
      ]"
      @click="handleTriggerList(PillarTitle.流年)"
    >
      流<br />年
    </div>
    <div class="rowList">
      <div
        v-for="(item, index) in store.paipanInfo.big.data[activeDyIndex].years"
        :key="'liunian_' + item.year"
        :class="[
          'dayunItem',
          {
            active: activeLnIndex === index,
          },
        ]"
        @click="handleLnItem(item, index)"
      >
        <p class="itemText">
          {{ item.year }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流月 -->
  <div v-if="lyData !== null" class="listCard">
    <div
      :class="[
        'listTilte',
        { active: store.pillarShowData.find((i) => i.title === PillarTitle.流月) },
      ]"
      @click="handleTriggerList(PillarTitle.流月)"
    >
      流<br />月
    </div>
    <div class="rowList">
      <div
        v-for="(item, index) in lyData"
        :key="'Liuyue_' + item.year + item.mouth + item.day"
        :class="[
          'dayunItem',
          {
            active: activeLyIndex === index,
          },
        ]"
        @click="handleLyItem(index)"
      >
        <p class="jieqi">{{ JQ_12[index] }}</p>
        <p class="itemText">
          {{ `${item.mouth}/${item.day}` }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流日 -->
  <div v-if="lrData !== null" class="listCard">
    <div
      :class="[
        'listTilte',
        { active: store.pillarShowData.find((i) => i.title === PillarTitle.流日) },
      ]"
      @click="handleTriggerList(PillarTitle.流日)"
    >
      流<br />日
    </div>
    <div class="rowList">
      <div
        v-for="(item, index) in lrData"
        :key="'Liuri_' + item.year + item.mouth + item.day"
        :class="[
          'dayunItem',
          {
            active: activeLrIndex === index,
          },
        ]"
        style="justify-content: flex-start"
        @click="handleLrItem(index)"
      >
        <p class="jieqi">{{ item.week }}</p>
        <p class="itemText">
          {{ `${item.mouth}/${item.day}` }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
        <p class="jqText">{{ item.jq_text || ' ' }}</p>
      </div>
    </div>
  </div>

  <!-- 流时 -->
  <div v-if="lsData !== null" class="listCard">
    <div
      :class="[
        'listTilte',
        { active: store.pillarShowData.find((i) => i.title === PillarTitle.流时) },
      ]"
      @click="handleTriggerList(PillarTitle.流时)"
    >
      流<br />时
    </div>
    <div class="rowList">
      <div
        v-for="(item, index) in lsData"
        :key="'Liushi_' + item.name"
        :class="[
          'dayunItem',
          {
            active: activeLsIndex === index,
          },
        ]"
        @click="activeLsIndex = index"
      >
        <p class="itemText">{{ item.name[1] }}时</p>
        <p class="itemText">{{ item.time_text }}</p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, shallowRef, watch } from 'vue';
import { JQ_12, JZ_60, LiuYueItem, paipan } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';
import { PillarTitle } from '../constant';
import WuxingText from './WuxingText.vue';

const store = useBaziStore();

const activeDyIndex = ref(-1);
const activeLnIndex = ref(-1);
const activeLyIndex = ref(-1);
const activeLrIndex = ref(-1);
const activeLsIndex = ref(-1);
const lyData = shallowRef<LiuYueItem[] | null>(null);
const lrData = shallowRef<LiuYueItem['days'] | null>(null);
const lsData = shallowRef<ReturnType<typeof paipan.getLiuShi> | null>(null);

// 显示隐藏表中的大运流年等
const triggerPillarDataShow = (
  isShow: boolean,
  targets = [
    PillarTitle.大运,
    PillarTitle.流年,
    PillarTitle.流月,
    PillarTitle.流日,
    PillarTitle.流时,
  ]
) => {
  store.setPillarData((s) => {
    s.forEach((i) => {
      if (targets.includes(i.title as PillarTitle)) {
        i.isShow = isShow;
      }
    });
    return [...s];
  });
};

const handleTriggerList = (target: PillarTitle) => {
  const title_active = store.pillarShowData.find((i) => i.title === target);

  const rest = [
    PillarTitle.大运,
    PillarTitle.流年,
    PillarTitle.流月,
    PillarTitle.流日,
    PillarTitle.流时,
  ];
  const index = rest.findIndex((i) => i === target);
  const targets = rest.splice(0, index + 1);

  if (title_active) {
    triggerPillarDataShow(false, [target].concat(rest));
  } else {
    triggerPillarDataShow(true, targets);
  }
};
const handleDyItem = (index: number) => {
  activeDyIndex.value = index;
  lyData.value = null;
  lrData.value = null;
  lsData.value = null;
};
const handleLnItem = (item: { name: JZ_60; year: number }, index: number) => {
  const data = paipan.getLiuYueByYear(item.year, item.name);
  //   console.log('handleLnItem', data);
  lyData.value = data;
  activeLnIndex.value = index;
  lrData.value = null;
  lsData.value = null;
};
const handleLyItem = (index: number) => {
  if (!lyData.value) return;
  lrData.value = lyData.value[index].days;
  activeLyIndex.value = index;
  lsData.value = null;
};
const handleLrItem = (index: number) => {
  if (!lrData.value) return;
  const newLsData = paipan.getLiuShi(getLsDate({ newLrIndex: index }));
  lsData.value = newLsData;
  activeLrIndex.value = index;
};

const getLsDate = ({
  newLiuYueData = lyData.value,
  newLyIndex = activeLyIndex.value,
  newLrIndex = activeLrIndex.value,
}: {
  newLiuYueData?: any;
  newLyIndex?: number;
  newLrIndex?: number;
}) => {
  if (newLiuYueData === null) {
    return new Date().getTime();
  }
  const ls_year = newLiuYueData[newLyIndex].year;
  const ls_mouth = newLiuYueData[newLyIndex].days[newLrIndex].mouth;
  const ls_day = newLiuYueData[newLyIndex].days[newLrIndex].day;
  const ls_date = new Date(`${ls_year}-${ls_mouth}-${ls_day}`);
  ls_date.setHours(0);
  // console.log('ls_date', ls_date.toLocaleString(), new Date().getHours());
  return ls_date.getTime();
};

const handleClose = () => {
  triggerPillarDataShow(false);
  activeDyIndex.value = -1;
  activeLnIndex.value = -1;
  activeLyIndex.value = -1;
  activeLrIndex.value = -1;
  activeLsIndex.value = -1;
  lyData.value = null;
  lrData.value = null;
  lsData.value = null;
};
const handleNow = async () => {
  const data = store.paipanInfo.big.data;

  // 流年、流月
  function _findYearMouthIndex(targetYear: number) {
    let newlnIndex = -1;
    let newDyIndex = data.findIndex((i) => {
      return i.years.find((j, yearsIndex) => {
        if (j.year === targetYear) {
          newlnIndex = yearsIndex;
          return true;
        }
        return false;
      });
    });

    // console.log('targetYear', targetYear);

    if (newDyIndex < 0 || newlnIndex < 0) {
      return null;
    }

    const ln_item = data[newDyIndex].years[newlnIndex];
    const newLiuYueData = paipan.getLiuYueByYear(ln_item.year, ln_item.name);
    const nowTime = new Date().getTime();
    let newLyIndex = newLiuYueData.findIndex((i) => {
      const last_day = i.days[i.days.length - 1];
      const mouth_max = new Date();
      mouth_max.setFullYear(last_day.year);
      mouth_max.setMonth(last_day.mouth - 1);
      mouth_max.setDate(last_day.day);
      mouth_max.setHours(23, 59, 59);
      return mouth_max.getTime() > nowTime;
    });
    if (newLyIndex === -1) {
      newLyIndex = 0;
    } else if (newLyIndex === 0) {
      const first_day = newLiuYueData[0].days[0];
      const mouth_max = new Date();
      mouth_max.setFullYear(first_day.year);
      mouth_max.setMonth(first_day.mouth - 1);
      mouth_max.setDate(first_day.day);
      mouth_max.setHours(0, 0, 0);
      if (mouth_max.getTime() > nowTime) {
        // 当前年的所有月份小于当前时间，则向前一年找
        // 这种情况一般发生在公历1月至立春前之间
        console.log('整体过大, 向前一年找', targetYear - 1);
        return _findYearMouthIndex(targetYear - 1);
      }
    }

    return { newDyIndex, newlnIndex, newLiuYueData, newLyIndex };
  }

  const YearMouthData = _findYearMouthIndex(new Date().getFullYear());
  if (YearMouthData === null) {
    return;
  }
  const { newDyIndex, newlnIndex, newLiuYueData, newLyIndex } = YearMouthData;

  // console.log('newLiuYueData', JSON.stringify(newLiuYueData, null, 4), newLyIndex);

  activeDyIndex.value = newDyIndex;
  activeLnIndex.value = newlnIndex;
  lyData.value = newLiuYueData;
  activeLyIndex.value = newLyIndex;

  // 流日
  // TODO 23点时就到下一天了
  let newLrIndex = newLiuYueData[newLyIndex].days.findIndex(
    (i) => i.mouth === new Date().getMonth() + 1 && i.day === new Date().getDate()
  );
  if (newLrIndex === -1) {
    newLrIndex = 0;
  }
  activeLrIndex.value = newLrIndex;
  lrData.value = newLiuYueData[newLyIndex].days;

  // 流时
  const ls_date = getLsDate({ newLiuYueData, newLyIndex, newLrIndex });
  // console.log('ls_date', ls_date.toLocaleString(), new Date().getHours());
  const newLsData = paipan.getLiuShi(ls_date);
  lsData.value = newLsData;
  const newLsIndex = Math.floor((new Date().getHours() + 1) / 2);
  activeLsIndex.value = newLsIndex;

  await nextTick();

  // 全部显示大运流年
  triggerPillarDataShow(true);

  // scroll to active position
  document.querySelectorAll('.rowList .active').forEach((el) => {
    // el.scrollIntoView({
    //   behavior: 'smooth', // 平滑滚动
    //   block: 'nearest', // 垂直方向不动
    //   inline: 'center', // 让被激活的元素滚动到横向正中间
    // });
    // 自动滚动在 tab 中存在问题，这里使用手动计算滚动距离
    scrollActiveToCenter(el as HTMLElement);
  });

  // 整体页面要再晚一些
  await nextTick();

  window.scrollTo({
    top: document.documentElement.scrollHeight, // 滚动到页面总高度的位置（即最底部）
    // behavior: 'smooth', // 平滑滚动动画
  });
};

function scrollActiveToCenter(active: HTMLElement) {
  const container = active.parentElement!;
  const left = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;

  container.scrollTo({
    left,
    behavior: 'smooth',
  });
}

// 大运流年流月等切换后自动更新四柱表
watch(
  [
    () => activeDyIndex.value,
    () => activeLnIndex.value,
    () => activeLrIndex.value,
    () => activeLsIndex.value,
    () => activeLyIndex.value,
    () => store.paipanInfo,
  ],
  () => {
    // // 初始化时不展示大运流年表
    // if (isInit.current) {
    //   isInit.current = false;
    //   return;
    // }

    const paipanInfo = store.paipanInfo;

    const dy = paipanInfo.big.data[activeDyIndex.value];
    if (!dy) return;
    let ln = dy.years[activeLnIndex.value];
    if (!ln) {
      if (activeLnIndex.value !== 0) {
        const lnIndex = 0;
        ln = dy.years[lnIndex];
        activeLnIndex.value = lnIndex;
      } else {
        // 变成0仍然没有, 这种情况一般是点到了小运
        if (!ln) {
          // 这种情况一般是出生不到一年就起大运，无小运
          //   Alert.alert('该命主无小运');
        }
      }
      return;
    }

    const activeLyData = lyData.value?.[activeLyIndex.value];
    const activeLrData = activeLyData?.days?.[activeLrIndex.value];
    if (lyData.value) {
      if (!activeLyData) {
        // console.log('activeLyData', activeLyData);
        activeLyIndex.value = 0;
        return;
      }
      if (!activeLrData) {
        // console.log('activeLrData', activeLrData);
        activeLrIndex.value = 0;
        return;
      }
    }
    const activeLsData = lsData.value?.[activeLsIndex.value];
    if (lsData.value && !activeLsData) {
      // console.log('activeLsData', activeLsData);
      activeLsIndex.value = 0;
      return;
    }

    store.setPillarData((s) => {
      // 大运
      const dyIndex = s.findIndex((i) => i.title === PillarTitle.大运);
      const dyItem = store.getListDataItem(
        dy.name === '小运' ? dy.xiaoyuns[activeLnIndex.value] : dy.name,
        PillarTitle.大运
      );
      if (dyIndex < 0) {
        s.push(dyItem);
      } else {
        dyItem.isShow = s[dyIndex].isShow;
        s[dyIndex] = dyItem;
      }
      // 流年
      const LnIndex = s.findIndex((i) => i.title === PillarTitle.流年);
      const LnItem = store.getListDataItem(ln.name, PillarTitle.流年);

      if (LnIndex < 0) {
        s.push(LnItem);
      } else {
        LnItem.isShow = s[LnIndex].isShow;
        s[LnIndex] = LnItem;
      }

      // 流月
      if (lyData.value) {
        // 流月
        const ly_tgdz = activeLyData!.name;
        const lyIndex = s.findIndex((i) => i.title === PillarTitle.流月);
        const lyItem = store.getListDataItem(ly_tgdz, PillarTitle.流月);
        if (lyIndex < 0) {
          s.push(lyItem);
        } else {
          lyItem.isShow = s[lyIndex].isShow;
          s[lyIndex] = lyItem;
        }

        // 流日
        const lr_tgdz = activeLrData!.name;
        const lrIndex = s.findIndex((i) => i.title === PillarTitle.流日);
        const lrItem = store.getListDataItem(lr_tgdz, PillarTitle.流日);
        if (lrIndex < 0) {
          s.push(lrItem);
        } else {
          lrItem.isShow = s[lrIndex].isShow;
          s[lrIndex] = lrItem;
        }

        // 流时
        if (lsData.value) {
          const ls_tgdz = lsData.value[activeLsIndex.value]?.name;
          const lsIndex = s.findIndex((i) => i.title === PillarTitle.流时);
          const lsItem = store.getListDataItem(ls_tgdz, PillarTitle.流时);

          if (lsIndex < 0) {
            s.push(lsItem);
          } else {
            lsItem.isShow = s[lsIndex].isShow;
            s[lsIndex] = lsItem;
          }
        }
      }

      return [...s];
    });
  }
);
</script>

<style lang="scss" scoped>
.theme-btn {
  padding: 8px;
  color: var(--global-theme-color);
  cursor: pointer;
}
.listCard {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 8px 0;
  background-color: #fff;
}
.listTilte {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 8px;
  padding: 16px 8px;
  width: 40px;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--global-theme-color);
  border-radius: 8px;

  &.active {
    background-color: var(--global-theme-color);
    color: #fff;
  }
}
.rowList {
  display: inline-flex;
  flex-direction: row;
  overflow-x: scroll;
  width: calc(100% - 40px - 16px);
  padding-bottom: 8px;

  .dayunItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border: 1px solid #fff;
    border-radius: 8px;
    cursor: pointer;

    &.active {
      border-color: var(--global-theme-color);
    }

    .itemText {
      margin-bottom: 4px;
      white-space: nowrap;
    }

    .jieqi {
      white-space: nowrap;
    }

    .jqText {
      margin-top: 4px;
      font-weight: bold;
      color: #f7540e;
      white-space: nowrap;
    }
  }
}
</style>
