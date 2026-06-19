import { Planent, Star } from './constant';

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
