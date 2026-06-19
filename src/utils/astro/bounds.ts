import { Planent, Star } from './constant';
import { PlanetItem } from './planets';

// 埃及界限表
const Egyptian = {
  [Star.Aries]: [
    { planet: Planent.Jupiter, start: 0, end: 6 },
    { planet: Planent.Venus, start: 6, end: 12 },
    { planet: Planent.Mercury, start: 12, end: 20 },
    { planet: Planent.Mars, start: 20, end: 25 },
    { planet: Planent.Saturn, start: 25, end: 30 },
  ],
  [Star.Taurus]: [
    { planet: Planent.Venus, start: 0, end: 8 },
    { planet: Planent.Mercury, start: 8, end: 14 },
    { planet: Planent.Jupiter, start: 14, end: 22 },
    { planet: Planent.Saturn, start: 22, end: 27 },
    { planet: Planent.Mars, start: 27, end: 30 },
  ],
  [Star.Gemini]: [
    { planet: Planent.Mercury, start: 0, end: 6 },
    { planet: Planent.Jupiter, start: 6, end: 12 },
    { planet: Planent.Venus, start: 12, end: 17 },
    { planet: Planent.Mars, start: 17, end: 24 },
    { planet: Planent.Saturn, start: 24, end: 30 },
  ],
  [Star.Cancer]: [
    { planet: Planent.Mars, start: 0, end: 7 },
    { planet: Planent.Venus, start: 7, end: 13 },
    { planet: Planent.Mercury, start: 13, end: 19 },
    { planet: Planent.Jupiter, start: 19, end: 26 },
    { planet: Planent.Saturn, start: 26, end: 30 },
  ],
  [Star.Leo]: [
    { planet: Planent.Jupiter, start: 0, end: 6 },
    { planet: Planent.Venus, start: 6, end: 11 },
    { planet: Planent.Saturn, start: 11, end: 18 },
    { planet: Planent.Mercury, start: 18, end: 24 },
    { planet: Planent.Mars, start: 24, end: 30 },
  ],
  [Star.Virgo]: [
    { planet: Planent.Mercury, start: 0, end: 7 },
    { planet: Planent.Venus, start: 7, end: 17 },
    { planet: Planent.Jupiter, start: 17, end: 21 },
    { planet: Planent.Mars, start: 21, end: 28 },
    { planet: Planent.Saturn, start: 28, end: 30 },
  ],
  [Star.Libra]: [
    { planet: Planent.Saturn, start: 0, end: 6 },
    { planet: Planent.Mercury, start: 6, end: 14 },
    { planet: Planent.Jupiter, start: 14, end: 21 },
    { planet: Planent.Venus, start: 21, end: 28 },
    { planet: Planent.Mars, start: 28, end: 30 },
  ],
  [Star.Scorpio]: [
    { planet: Planent.Mars, start: 0, end: 7 },
    { planet: Planent.Venus, start: 7, end: 11 },
    { planet: Planent.Mercury, start: 11, end: 19 },
    { planet: Planent.Jupiter, start: 19, end: 24 },
    { planet: Planent.Saturn, start: 24, end: 30 },
  ],
  [Star.Sagittarius]: [
    { planet: Planent.Jupiter, start: 0, end: 12 },
    { planet: Planent.Venus, start: 12, end: 17 },
    { planet: Planent.Mercury, start: 17, end: 21 },
    { planet: Planent.Saturn, start: 21, end: 26 },
    { planet: Planent.Mars, start: 26, end: 30 },
  ],
  [Star.Capricorn]: [
    { planet: Planent.Mercury, start: 0, end: 7 },
    { planet: Planent.Jupiter, start: 7, end: 14 },
    { planet: Planent.Venus, start: 14, end: 22 },
    { planet: Planent.Saturn, start: 22, end: 26 },
    { planet: Planent.Mars, start: 26, end: 30 },
  ],
  [Star.Aquarius]: [
    { planet: Planent.Mercury, start: 0, end: 7 },
    { planet: Planent.Venus, start: 7, end: 13 },
    { planet: Planent.Jupiter, start: 13, end: 20 },
    { planet: Planent.Mars, start: 20, end: 25 },
    { planet: Planent.Saturn, start: 25, end: 30 },
  ],
  [Star.Pisces]: [
    { planet: Planent.Venus, start: 0, end: 12 },
    { planet: Planent.Jupiter, start: 12, end: 16 },
    { planet: Planent.Mercury, start: 16, end: 19 },
    { planet: Planent.Mars, start: 19, end: 28 },
    { planet: Planent.Saturn, start: 28, end: 30 },
  ],
};

// 计算界限
export function calcBound(sign: Star, degree: number) {
  let res = null;
  const boundArr = Egyptian[sign];
  if (!boundArr) return res;

  for (let i = 0; i < boundArr.length; i++) {
    const item = boundArr[i];
    if (degree >= item.start && degree < item.end) {
      res = item.planet;
      break;
    }
  }

  return res;
}

// 行星状态
export function getPlanetState(planetList: PlanetItem[]) {
  const res = [];
  planetList.forEach((item) => {
    console.log(item);
    const planet = item.name;
    const boundName = String(item.bound);

    const isDignity = item.dignity === 'Domicile' || item.dignity === 'Exaltation';
    const isFall = item.dignity === 'Detriment' || item.dignity === 'Fall';

    if (planet === boundName) {
      // 本位
      if (isDignity) {
        // 庙旺
      } else if (isFall) {
        // 落陷
      } else {
        // 游走
      }
      res.push({ planet, type: 'Own_Term' });
    } else {
      // 非本位, 看界主状态
      const bound = planetList.find((i) => i.name === boundName)!;
      const boundDignity = bound.dignity === 'Domicile' || bound.dignity === 'Exaltation';
      const boundFall = bound.dignity === 'Detriment' || bound.dignity === 'Fall';
      const boundBenefic = boundName === Planent.Venus || boundName === Planent.Jupiter;
      const boundMalefic = boundName === Planent.Mars || boundName === Planent.Saturn;
      const boundNeutral =
        boundName === Planent.Mercury &&
        bound.sign === Star.Virgo &&
        bound.bound === Planent.Mercury;

      // 自己庙旺
      if (isDignity) {
        // 界主也庙旺
        if (boundDignity) {
          // 吉星
          // 凶星
          // 中性
        } else if (boundFall) {
          // 界主落陷
        } else {
          // 界主游走
        }
      }
    }
  });
}

// 得到界限运动图
export function getBoundMap(
  data: {
    bound: Planent | null;
    planet: Planent;
  }[]
) {
  const res: (Planent | null)[][] = [];

  data.forEach((item) => {
    const chain = [item.planet, item.bound];
    let prev = item.bound;
    let next = data.find((i) => i.planet === prev);
    while (next && next.bound && next.bound !== next.planet && !chain.includes(next.bound)) {
      prev = next.bound;
      next = data.find((i) => i.planet === prev);
      next && chain.push(next.planet);
    }
    res.push(chain);
  });

  return res;
}
