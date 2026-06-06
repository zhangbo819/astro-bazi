// Astronomy Engine 轻量计算 各行星实时位置无上升无宫位 可用于客户端
import { Body, Ecliptic, GeoVector } from 'astronomy-engine';

export const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// export enum Planets {
//   Sun = Body.Sun,
//   Moon = Body.Moon,
//   Mercury = Body.Mercury,
//   Venus = Body.Venus,
//   Mars = Body.Mars,
//   Jupiter = Body.Jupiter,
//   Saturn = Body.Saturn,
//   Uranus = Body.Uranus,
//   Neptune = Body.Neptune,
//   Pluto = Body.Pluto,
// }

const BODIES = [
  Body.Sun,
  Body.Moon,
  Body.Mercury,
  Body.Venus,
  Body.Mars,
  Body.Jupiter,
  Body.Saturn,
  Body.Uranus,
  Body.Neptune,
  Body.Pluto,
];

interface PlanetItem {
  name: Body;
  sign: string;
  degree: number;
  longitude: number;
  retrograde: boolean;
}

function getPlanetInfo(body: Body, date: Date) {
  const vec = GeoVector(body, date, true);
  const ecl = Ecliptic(vec);

  const lon = (ecl.elon + 360) % 360;

  return {
    name: body,
    sign: SIGNS[Math.floor(lon / 30)],
    degree: +(lon % 30).toFixed(2),
    longitude: lon,
  };
}

// 拿到10行星的经度 落座 度数
export function getAllPlanets(date = new Date()): PlanetItem[] {
  return BODIES.map((body) => ({
    ...getPlanetInfo(body, date),
    retrograde: isRetrograde(body, date),
  }));
}

// 判断是否逆行
export function isRetrograde(body: Body, date: Date) {
  // 日月不会逆行
  if (body === Body.Sun || body === Body.Moon) return false;

  const dt = 60 * 60 * 1000; // 一小时

  const lon1 = getPlanetInfo(body, date).longitude;
  const lon2 = getPlanetInfo(body, new Date(date.getTime() + dt)).longitude;

  let diff = lon2 - lon1; // 每小时移动多少度

  // 处理跨360°
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

// 相位
class PhasePosition {
  ASPECTS = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 4 },
    { name: 'Square', angle: 90, orb: 6 },
    { name: 'Trine', angle: 120, orb: 6 },
    { name: 'Opposition', angle: 180, orb: 8 },
  ];
  private getDynamicOrb(n1: PlanetItem['name'], n2: PlanetItem['name'], baseOrb: number) {
    if (n1 === Body.Sun || n2 === Body.Sun) return baseOrb + 2;
    if (n1 === Body.Moon || n2 === Body.Moon) return baseOrb + 2;
    return baseOrb;
  }
  private getAngleDiff(a: number, b: number) {
    const diff = Math.abs(a - b);
    return diff > 180 ? 360 - diff : diff;
  }
  private getAspect(n1: PlanetItem['name'], n2: PlanetItem['name'], diff: number) {
    for (const asp of this.ASPECTS) {
      const orb = this.getDynamicOrb(n1, n2, asp.orb);
      if (Math.abs(diff - asp.angle) <= orb) {
        return {
          type: asp.name,
          exact: diff,
          orb: +Math.abs(diff - asp.angle).toFixed(2),
        };
      }
    }
    return null;
  }
  public calculateAspects(planets: PlanetItem[]) {
    const aspects = [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];

        const diff = this.getAngleDiff(p1.longitude, p2.longitude);
        const aspect = this.getAspect(p1.name, p2.name, diff);

        if (aspect) {
          aspects.push({
            between: [p1.name, p2.name],
            type: aspect.type,
            angle: diff.toFixed(2),
            orb: aspect.orb,
            strength: aspect.orb < 1 ? 'strong' : 'normal',
          });
        }
      }
    }

    // 按紧密度排序
    // aspects.sort((a, b) => a.orb - b.orb);

    return aspects;
  }
}

export const phasePosition = new PhasePosition();
