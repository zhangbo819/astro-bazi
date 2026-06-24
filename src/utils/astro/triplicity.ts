// 三分主星
// 规则
// 元素	  日盘主星	夜盘主星	参与主星
// 火象	  太阳	   木星	       土星
// 土象	  金星	   月亮	       火星
// 风象	  土星	   水星	       木星
// 水象	  金星	   火星	       月亮

import { AstroElement, Planent, Star } from './constant';
import { PlanetItem } from './planets';

const rules_day: Record<AstroElement, [Planent, Planent, Planent]> = {
  Fire: [Planent.Sun, Planent.Jupiter, Planent.Saturn],
  Earth: [Planent.Venus, Planent.Moon, Planent.Mars],
  Air: [Planent.Saturn, Planent.Mercury, Planent.Jupiter],
  Water: [Planent.Venus, Planent.Mars, Planent.Moon],
};
const rules_night: Record<AstroElement, [Planent, Planent, Planent]> = {
  Fire: [Planent.Jupiter, Planent.Sun, Planent.Saturn],
  Earth: [Planent.Moon, Planent.Venus, Planent.Mars],
  Air: [Planent.Mercury, Planent.Saturn, Planent.Jupiter],
  Water: [Planent.Mars, Planent.Venus, Planent.Moon],
};

export type calcTriplicityRes = {
  name: Planent;
  sign: Star;
  rule: [Planent, Planent, Planent];
  tripliity: { index: number; ruler: string } | null;
}[];
export function calcTriplicity(planetList: PlanetItem[], isDay: boolean): calcTriplicityRes {
  const rule = isDay ? rules_day : rules_night;
  const res: calcTriplicityRes = [];

  const ruler_map = isDay
    ? ['日盘主星', '夜盘主星', '参与主星']
    : ['夜盘主星', '日盘主星', '参与主星'];

  planetList.forEach((item) => {
    const { sign } = item;
    const name = String(item.name) as Planent;
    const tripliityData = rule[item.element];
    //   console.log(name, sign, tripliityData);
    const index = tripliityData.findIndex((i) => i === name);
    res.push({
      name,
      sign,
      rule: tripliityData,
      tripliity: index !== -1 ? { index, ruler: ruler_map[index] } : null,
    });
  });
  return res;
}
