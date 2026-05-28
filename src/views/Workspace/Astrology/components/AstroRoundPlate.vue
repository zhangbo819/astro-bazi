<template>
  <!-- 占星圆盘 -->
  <div class="constellation">
    <!-- 宫头部分 -->
    <div class="line" />
    <div class="line line30" />
    <div class="line line60" />
    <div class="line line90" />
    <div class="line line120" />
    <div class="line line150" />

    <div
      v-for="(item, index) in title12"
      :key="item"
      class="house"
      :style="{ '--angle': `-${15 + index * 30}deg` }"
    >
      <span :style="{ color: map12[item].color }">{{ map12[item].n }}</span>
    </div>

    <!-- 行星盘 -->
    <div class="plate">
      <div class="line" />
      <div class="line line30" />
      <div class="line line60" />
      <div class="line line90" />
      <div class="line line120" />
      <div class="line line150" />

      <!-- 相位线 -->
      <svg ref="svgRef" class="aspect-box">
        <transition-group name="aspect">
          <path
            v-for="item in aspectLines"
            :key="item.n1 + '-' + item.n2"
            :d="`M ${item.p1.x} ${item.p1.y} L ${item.p2.x} ${item.p2.y}`"
            class="aspect-line"
            :style="{
              '--m-color': item.color,
              '--m-opacity': item.isStrong ? 1 : 0.8,
            }"
          />
        </transition-group>
      </svg>

      <!-- 运动的行星 -->
      <div
        v-for="item in data"
        :key="item.name"
        :class="{ star: true, 'no-transition': disableTransition[item.name] }"
        :style="{ '--angle': -1 * css_longitude[item.name] + 'deg' }"
      >
        <div class="dot" />
        <!-- :ref="(el) => setLabelRef(el as HTMLDivElement, index)" -->
        <p
          class="planent-name"
          :style="[
            // labelOffsets[index]
            //   ? { transform: `translate(${labelOffsets[index].x}px, ${labelOffsets[index].y}px)` }
            //   : {},
            {
              color: planentsMap[item.name].color,
              '--rot': -planentRota[item.name] + 'deg',
            },
          ]"
          @click="onClickPlanent(item)"
        >
          {{ planentsMap[item.name].n ?? planentsMap[item.name].name.slice(0, 1) }}
        </p>
      </div>
    </div>
  </div>

  <!-- 圆角弹窗（居中） -->
  <Teleport to="body">
    <van-popup
      v-model:show="showPopup"
      round
      class="aspect-popup"
      :overlay-style="{
        '--van-overlay-background': 'rgba(0, 0, 0, .2)',
      }"
    >
      <template v-if="activeAspect.plant">
        <h2>
          <span :style="{ color: planentsMap[activeAspect.plant.name].color }"
            >{{ activeAspect.plant.name }} {{ planentsMap[activeAspect.plant.name].name }}
            {{ planentsMap[activeAspect.plant.name].symbol }}</span
          >&nbsp;
          <span> {{ `[${activeAspect.plant.retrograde ? '逆行' : '顺行'}]` }}</span>
        </h2>
        <strong>{{ planetTexts[activeAspect.plant.name].short }}</strong>
        <h3>
          落在
          <span
            class="navText"
            :style="{ color: map12[activeAspect.plant.sign].color }"
            @click="onClickSign"
            >{{ activeAspect.plant.sign }}
            {{ map12[activeAspect.plant.sign].name }}
          </span>
          {{ map12[activeAspect.plant.sign].icon }}
          {{ activeAspect.plant.degree }}°
        </h3>
      </template>
      <template v-if="activeAspect.aspects.length">
        <div v-for="(item, index) in activeAspect.aspects" :key="item.between.join('-')">
          <p>
            &nbsp;&nbsp;
            <strong>{{ index + 1 }}. </strong>
            <span
              :style="{
                fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
              }"
            >
              与
              <span :style="{ color: planentsMap[item.other].color }"
                >{{ item.other }} {{ planentsMap[item.other].name }}
                {{ planentsMap[item.other].symbol }}</span
              >
              成
              <span :style="{ color: aspectPosition.map[item.type].color }">
                {{ item.type }}
                {{ aspectPosition.map[item.type].name }}
                {{ aspectPosition.map[item.type].symbol }}
                {{ item.angle }}°
              </span>
              &nbsp;
              <span> {{ item.strength }} ({{ item.orb }}°) </span>
            </span>
          </p>
        </div>
      </template>
      <p
        v-else-if="activeAspect.plant"
        :style="{ fontWeight: 'bold', color: planentsMap[activeAspect.plant.name].color }"
      >
        空相
      </p>
    </van-popup>
  </Teleport>
</template>
<script setup lang="tsx">
import { computed, onMounted, onUnmounted, ref, toRef } from 'vue';
import { AspectItem, aspectPosition, PlanetItem } from '@/utils/astro/planets';
import { map12, planentsMap, planetTexts, title12 } from '@/utils/astro/astroUI';
import { useAvoidPlanetOverlap, useResetLongitude } from '../hooks';
import router from '@/router';

const props = defineProps<{ data: PlanetItem[] }>();

// 解决在跨 360° 旋转时，CSS 会走 358°反方向动画
const { css_longitude, disableTransition } = useResetLongitude(toRef(props, 'data'));

// 计算行星偏移量，避免行星重叠
const planentRota = useAvoidPlanetOverlap(toRef(props, 'data'));

// const refDot = ref<HTMLDivElement[]>([]);

const svgRef = ref<SVGSVGElement | null>(null);

// 相位线
const svgPosition = ref({ r: 0 });
let timer: ReturnType<typeof setTimeout> | null = null;
const update = () => {
  if (!svgRef.value) return;
  const rect = svgRef.value.getBoundingClientRect();

  // console.log("in", rect.width / 2);

  svgPosition.value = {
    r: rect.width / 2,
  };
};
const onResize = () => {
  timer && clearTimeout(timer);

  timer = setTimeout(update, 50);
};
onMounted(() => {
  update();
  window.addEventListener('resize', onResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

// 相位线数据
const aspectLines = computed(() => {
  const aspectData = aspectPosition.getData(props.data);

  const map = props.data.reduce((r, p) => {
    r[p.name] = aspectPosition.getPosition(p.longitude, svgPosition.value.r);
    return r;
  }, {} as Record<PlanetItem['name'], { x: number; y: number }>);

  const res = aspectData.map((i) => {
    const [n1, n2] = i.between;

    return {
      n1,
      n2,
      p1: map[n1],
      p2: map[n2],
      color: aspectPosition.map[i.type].color,
      isStrong: i.strength === 'strong',
    };
  });

  return res;
});

// 行星提示弹窗
const showPopup = ref(false);
const activeAspect = ref<{
  plant: PlanetItem | null;
  aspects: (AspectItem & { other: PlanetItem['name'] })[];
}>({
  plant: null,
  aspects: [],
});
const onClickPlanent = (item: PlanetItem) => {
  // console.log(item);
  showPopup.value = true;
  const aspectData = aspectPosition.getData(props.data);

  const aspects = aspectData
    .filter((i) => i.between.includes(item.name))
    .map((i) => ({
      ...i,
      other: i.between.find((i) => i !== item.name)!,
    }));

  activeAspect.value = { plant: { ...item }, aspects };
};

const onClickSign = () => {
  if (!activeAspect.value.plant) return;

  const { name, sign } = activeAspect.value.plant;

  router.push({
    path: '/astrology/interpret',
    query: { name, sign },
  });
};
</script>

<style lang="scss" scoped>
.constellation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 18px auto;
  width: 80%;
  min-width: 360px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: #000;
  overflow: hidden;

  .line {
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #393939;
  }
  > .line {
    height: 2px;
  }
  .line30 {
    transform: rotate(30deg);
  }
  .line60 {
    transform: rotate(60deg);
  }
  .line90 {
    transform: rotate(90deg);
  }
  .line120 {
    transform: rotate(120deg);
  }
  .line150 {
    transform: rotate(150deg);
  }

  .house {
    position: absolute;
    left: 50%;
    width: 50%;
    text-align: left;
    transform-origin: right;
    z-index: 10;
    color: #fff;
    font-size: clamp(14px, 2.5vw, 32px);
    // font-weight: bold;
    transform: rotate(var(--angle)) translateX(-95%) rotate(calc(-1 * var(--angle)));
    pointer-events: none;
    > span {
      display: inline-block;
      transform: translateX(-50%);
    }
  }
}
.plate {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 89%;
  height: 89%;
  border-radius: 50%;
  background-color: #000;
  border: 1px solid #333;

  --anim-time: 0.6s;
  --anim-fn: cubic-bezier(0.22, 1, 0.36, 1); // 惯性效果
  // transition: transform 0.2s linear; // 月
  // transition: transform var(--anim-time) cubic-bezier(0.4, 0, 0.2, 1); // 慢惯性

  .star {
    position: absolute;
    left: 50%;
    width: 50%;
    display: flex;
    align-items: center;
    text-align: left;
    transform: rotate(var(--angle)) translateX(-80%) rotate(calc(-1 * var(--angle)));
    transition: transform var(--anim-time) var(--anim-fn);

    &.no-transition {
      transition: none !important;
    }

    .dot {
      width: 4px;
      height: 4px;
      transform: translateX(-50%);
      background: #f00;
      border-radius: 50%;
    }
    .planent-name {
      // margin-left: 8px;
      --fs: clamp(14px, 2.5vw, 32px);

      position: absolute;
      left: calc(var(--fs) / -2);
      transform: rotate(var(--rot)) translateX(2.5vw) rotate(calc(-1 * var(--rot)));
      transform-origin: left center;
      color: #fffb;
      font-size: var(--fs);
      line-height: var(--fs); // 行高也要设置和字体大小一致，否则会有空白影响背景
      // font-weight: bold;
      background-color: #0008; // 给文字带个背景，让文字在相位线上时更显眼
      cursor: pointer;
    }
  }

  .aspect-box {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;

    // transition d，保证更新x y 后的需要移动的线也有动画
    .aspect-line {
      fill: none; /* ❗非常关键 */
      stroke: var(--m-color); /* 线的颜色 */
      stroke-width: 1; /* 线宽 */
      transition: d var(--anim-time) var(--anim-fn), opacity var(--anim-time);
      opacity: var(--m-opacity);
    }

    // 新的线缓缓出现
    .aspect-enter-from {
      opacity: 0;
    }
    .aspect-enter-to {
      opacity: var(--m-opacity);
    }

    // 确保离开时瞬间消失
    .aspect-leave-active {
      transition: none !important;
    }
    .aspect-leave-from,
    .aspect-leave-to {
      opacity: 0;
    }
  }
}

.aspect-popup {
  padding: 0 2em 1em;
  max-width: 90%;
  text-align: left;
  h2,
  h3 {
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
  }
}

.navText {
  text-decoration: underline;
  cursor: pointer;
}
</style>
