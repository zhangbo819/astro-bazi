import { nextTick, onMounted, reactive, Ref, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { PlanetItem } from '@/utils/astro/planets';
import { BODIES } from '@/utils/astro/constant';

type nameLongitudeMap = Record<PlanetItem['name'], PlanetItem['longitude']>;

// 解决在跨 360° 旋转时，CSS 会走 358°反方向动画
// 方案在从 350+ -> 1 时，让其变成 350+ -> 361，然后在后续避免无限增加在达到某个临界点进行恢复 如 400 -> 40
export function useResetLongitude(data: Ref<PlanetItem[]>) {
  const css_longitude = ref<nameLongitudeMap>(
    BODIES.reduce((r, key) => {
      r[key] = 0;
      return r;
    }, {} as nameLongitudeMap)
  );
  const disableTransition = ref(
    BODIES.reduce((r, key) => {
      r[key] = false;
      return r;
    }, {} as Record<PlanetItem['name'], boolean>)
  );
  function normalizeAngle(prev: number, next: number) {
    const diff = next - prev;

    if (diff > 180) next -= 360;
    if (diff < -180) next += 360;

    return next;
  }
  watch(
    () => data.value,
    (newVal, oldVal) => {
      const res = newVal.reduce((r, p) => {
        r[p.name] = p.longitude;
        return r;
      }, {} as nameLongitudeMap);

      const needResetName: PlanetItem['name'][] = [];
      if (oldVal) {
        newVal.forEach((p) => {
          const prev = css_longitude.value[p.name];
          const next = res[p.name];

          const fixed = normalizeAngle(prev, next);

          // TODO bug: 现在顺时针时还会有问题
          // debug
          if (p.name === 'Moon') {
            console.log(fixed);
          }

          // ⭐ 在这里做“安全重置”
          const LIMIT = 400;

          const isNeedReset = Math.abs(fixed) > LIMIT;

          if (isNeedReset) {
            needResetName.push(p.name);
            res[p.name] = fixed % 360;
          } else {
            res[p.name] = fixed;
          }
        });
        // 有需要重置的
        if (needResetName.length) {
          // res 新的并且可能有多个
          const resetVal = oldVal.reduce((r, p) => {
            if (needResetName.includes(p.name)) {
              p.longitude %= 360;
              disableTransition.value[p.name] = true;
            }
            r[p.name] = p.longitude;
            return r;
          }, {} as nameLongitudeMap);
          css_longitude.value = resetVal; // 无动画清空原值

          // 强制下一帧恢复动画
          requestAnimationFrame(() => {
            needResetName.forEach((name) => (disableTransition.value[name] = false));
            // 恢复新值
            requestAnimationFrame(() => {
              // console.log("最后再向前移动");
              css_longitude.value = res;
            });
          });
        } else {
          // 马上更新
          css_longitude.value = res;
        }
      } else {
        // 马上更新
        css_longitude.value = res;
      }
    },
    { immediate: true }
  );

  return { css_longitude, disableTransition };
}

type PlanentRotaItem = Record<string, number>;

// 计算行星偏移量，避免行星重叠
// TODO 仍有可能会重叠，需要优化
export function useAvoidPlanetOverlap(data: Ref<PlanetItem[]>) {
  const planentRota = ref<PlanentRotaItem>({});

  //   TODO 优化： 将其分两种情况，聚集的组和排成一条线的组
  function groupClosePlanets(planets: PlanetItem[]) {
    const threshold = 8; // 8 度为一组
    const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);

    const groups = [];
    let current = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];

      if (Math.abs(cur.longitude - prev.longitude) <= threshold) {
        current.push(cur);
      } else {
        groups.push(current);
        current = [cur];
      }
    }

    groups.push(current);

    // 当 350多度时，也会和 0 度左右的第一组成一组
    const first_group = groups[0][0];
    const last_group = groups[groups.length - 1];
    if (first_group.longitude + (360 - last_group[last_group.length - 1].longitude) <= threshold) {
      groups.pop();
      groups[0] = last_group.concat(groups[0]);
    }

    return groups;
  }
  function applyLabelRotation(groups: PlanetItem[][]) {
    const result: PlanentRotaItem = {};

    for (const group of groups) {
      const len = group.length;

      group.forEach((p, i) => {
        let rotation = 0;

        if (len === 1) {
          // 只有一个组时，在左侧时文字靠左，在右侧时文字靠右
          rotation = p.longitude < 90 || p.longitude > 270 ? 180 : 0;
        } else {
          // 让 label 在一个小扇形内分散
          const spread = 360; // 总展开角度
          // 目前是将离得很近的编一个组，然后分配度数进行旋转
          rotation = (spread / len) * (i + 1); // TODO 旋转逻辑再优化，旋转后仍有可能会遮挡
        }

        result[p.name] = rotation;
      });
    }

    return result;
  }

  // 数据一变全部重新计算
  watch(
    () => data.value,
    (val) => {
      const groups = groupClosePlanets(val);
      // console.log("groups", groups);
      planentRota.value = applyLabelRotation(groups);
      // console.log(planentRota.value);
    },
    { immediate: true }
  );

  return planentRota;
}

// 暂未使用 同步改变地址栏
export function useQuerySync(key: string, defaultValue = '') {
  const route = useRoute();
  const router = useRouter();

  const state = ref(route.query[key] ?? defaultValue);

  // state → url
  watch(state, (val) => {
    if (val !== route.query[key]) {
      router.replace({
        query: {
          ...route.query,
          [key]: val || undefined,
        },
      });
    }
  });

  // url → state
  watch(
    () => route.query[key],
    (val) => {
      if (val !== state.value) {
        state.value = val ?? defaultValue;
      }
    }
  );

  return state;
}

// 暂未使用
// 动态改变 星盘中行星的 text 位置避免遮挡
function useStarText() {
  const labelRefs = ref<(HTMLDivElement | null)[]>([]);
  const labelOffsets = reactive<Record<number, { x: number; y: number }>>({});

  const setLabelRef = (el: HTMLDivElement | null, index: number) => {
    if (el) labelRefs.value[index] = el;
  };

  function isOverlapping(a: DOMRect, b: DOMRect) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function resolveCollisions() {
    const boxes = labelRefs.value.map((el) => ({
      el,
      rect: el!.getBoundingClientRect(),
      x: 0,
      y: 0,
    }));

    const offsetStep = 6; // 每次推开 6px
    let changed = true;

    let iteration = 0;
    const maxIteration = 20;

    while (changed && iteration < maxIteration) {
      changed = false;
      iteration++;

      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];

          if (isOverlapping(a.rect, b.rect)) {
            changed = true;

            const dx = b.rect.left - a.rect.left;
            const dy = b.rect.top - a.rect.top;

            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            const offsetX = (dx / dist) * offsetStep;
            const offsetY = (dy / dist) * offsetStep;

            a.x -= offsetX;
            a.y -= offsetY;

            b.x += offsetX;
            b.y += offsetY;

            // 更新 rect（模拟新位置）
            a.rect = new DOMRect(a.rect.x + a.x, a.rect.y + a.y, a.rect.width, a.rect.height);

            b.rect = new DOMRect(b.rect.x + b.x, b.rect.y + b.y, b.rect.width, b.rect.height);
          }
        }
      }
    }

    // apply transform
    boxes.forEach((b, index) => {
      if (b.el) {
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
        // labelOffsets[index].x = b.x;
        // labelOffsets[index].y = b.y;
      }
    });
  }

  onMounted(async () => {
    await nextTick();
    resolveCollisions();
  });
}
