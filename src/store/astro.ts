import { ref, shallowRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { aspectPosition, getAllPlanets, PlanetItem } from '@/utils/astro/planets';
import { AspectPatternEngine, ConjunctionGroup, Pattern } from '@/utils/astro/aspectPattern';
import { calcReception, calcReceptionRes } from '@/utils/astro/bounds';
import { calcTriplicity, calcTriplicityRes } from '@/utils/astro/triplicity';
import { DignityMap } from '@/utils/astro/astroUI';
import { ClassicalPlanent } from '@/utils/astro/constant';

export const useAstroStore = defineStore('astro', () => {
  const time = ref(new Date());

  const setTime = (v: Date | number) => {
    time.value = typeof v === 'number' ? new Date(v) : v;
  };

  // 行星数据
  const planetList = shallowRef(getAllPlanets(time.value));
  watch(
    () => time.value,
    () => {
      planetList.value = getAllPlanets(time.value);
    }
  );

  // 相位
  const aspectData = shallowRef(aspectPosition.getData(planetList.value, time.value));
  watch([() => planetList.value, () => time.value], () => {
    aspectData.value = aspectPosition.getData(planetList.value, time.value);
  });

  // 格局
  const patternData = shallowRef<Pattern[]>([]);
  const conjunctionGroups = shallowRef<ConjunctionGroup[]>([]);
  const stellium = shallowRef<
    {
      name: PlanetItem['sign'];
      data: PlanetItem[];
    }[]
  >([]);

  watch([() => aspectData.value, () => planetList.value], () => {
    const engine = new AspectPatternEngine(aspectData.value, planetList.value);
    const res = engine.detectAll();

    patternData.value = res.patterns;
    conjunctionGroups.value = res.conjunctionGroups;
    stellium.value = res.stellium;
  });

  // 古典分数
  const classicalScore = ref<
    { name: PlanetItem['name']; sign: PlanetItem['sign']; score: number; color: string }[]
  >([]);
  // 三分主星
  const isDayByTriplicity = ref(true);
  const triplicity = shallowRef<calcTriplicityRes>(
    calcTriplicity(planetList.value, isDayByTriplicity.value)
  );
  watch([() => planetList.value, () => isDayByTriplicity.value], () => {
    triplicity.value = calcTriplicity(planetList.value, isDayByTriplicity.value);

    // console.log('planetList', planetList.value);
    // console.log('triplicity.value', triplicity.value);
    classicalScore.value = planetList.value
      .filter((p) => ClassicalPlanent.includes(String(p.name) as any))
      .map((p) => {
        const dignity_score = Number(DignityMap[p.dignity].score);
        const triplicity_score = triplicity.value.find((i) => i.name === String(p.name))?.tripliity
          ? 3
          : 0;
        const bounds_score = p.bound === String(p.name) ? 2 : 0;
        const face_score = p.face === String(p.name) ? 1 : 0;
        const score = dignity_score + triplicity_score + bounds_score + face_score;
        return {
          name: p.name,
          sign: p.sign,
          score,
          color: score >= 5 ? '#67c23a' : score <= -5 ? '#f56c6c' : '#000',
        };
      });
  });

  // 互溶
  const bothDomicile = ref(true);
  const planetReception = shallowRef<calcReceptionRes>([]);
  watch([() => aspectData.value, () => planetList.value, () => bothDomicile.value], () => {
    planetReception.value = calcReception(
      planetList.value,
      aspectData.value.map(({ between, type }) => ({ between, type })),
      !bothDomicile.value
    );
  });

  return {
    time,
    planetList,
    setTime,
    aspectData,
    patternData,
    conjunctionGroups,
    stellium,
    isDayByTriplicity,
    triplicity,
    bothDomicile,
    planetReception,
    classicalScore,
  };
});
