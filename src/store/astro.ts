import { computed, ref, shallowRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { aspectPosition, getAllPlanets } from '@/utils/astro/planets';
import { AspectPatternEngine, ConjunctionGroup, Pattern } from '@/utils/astro/aspectPattern';

export const useAstroStore = defineStore('astro', () => {
  const time = ref(new Date());

  const setTime = (v: Date | number) => {
    time.value = typeof v === 'number' ? new Date(v) : v;
  };

  const planetList = computed(() => {
    return getAllPlanets(time.value);
  });

  //   const planetMap = computed(() => Object.fromEntries(planetList.value.map((p) => [p.name, p])));

  // 相位
  // TODO shallowRef
  const aspectData = computed(() => {
    return aspectPosition.getData(planetList.value).map((i) => {
      const r = aspectPosition.findAspectWindow(time.value, i.between[0], i.between[1], i.type);
      return {
        ...i,
        window: r,
      };
    });
  });

  // 格局
  const patternData = shallowRef<Pattern[]>([]);
  const conjunctionGroups = shallowRef<ConjunctionGroup[]>([]);

  watch([() => aspectData.value, () => planetList.value], () => {
    const engine = new AspectPatternEngine(aspectData.value, planetList.value);
    const res = engine.detectAll();

    patternData.value = res.patterns;
    conjunctionGroups.value = res.conjunctionGroups;
  });

  return {
    time,
    planetList,
    setTime,
    aspectData,
    patternData,
    conjunctionGroups,
  };
});
