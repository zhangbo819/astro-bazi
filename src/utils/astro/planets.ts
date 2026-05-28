// Astronomy Engine 轻量计算 各行星实时位置无上升无宫位 可用于客户端
import { Body, Ecliptic, GeoVector, PairLongitude } from 'astronomy-engine';
import {
  ASTRO_ELEMENTS,
  ASTRO_MODALITIES,
  AstroElement,
  AstroModality,
  BODIES,
  BodyInUse,
  SIGN_ELEMENT_MAP,
  SIGN_MODALITY_MAP,
  Star,
} from './constant';
import { DignityStatus, getPlanetDignityStatus } from './dignity';

const SIGNS = [
  Star.Aries,
  Star.Taurus,
  Star.Gemini,
  Star.Cancer,
  Star.Leo,
  Star.Virgo,
  Star.Libra,
  Star.Scorpio,
  Star.Sagittarius,
  Star.Capricorn,
  Star.Aquarius,
  Star.Pisces,
];

export interface PlanetItem {
  name: BodyInUse;
  sign: Star;
  degree: number;
  longitude: number;
  retrograde: boolean;
  element: AstroElement;
  modality: AstroModality;
  dignity: DignityStatus;
}

// 拿单行星落座
export function getPlanetInfo(name: BodyInUse, date: Date) {
  const vec = GeoVector(name, date, true);
  const ecl = Ecliptic(vec);

  const lon = (ecl.elon + 360) % 360;

  return {
    name,
    sign: SIGNS[Math.floor(lon / 30)],
    degree: +(lon % 30).toFixed(2),
    longitude: lon,
  };
}

// 拿到10行星的经度 落座 度数
export function getAllPlanets(date = new Date()): PlanetItem[] {
  return BODIES.map((name) => {
    const info = getPlanetInfo(name, date);
    return {
      ...info,
      retrograde: isRetrograde(name, date),
      element: SIGN_ELEMENT_MAP[info.sign],
      modality: SIGN_MODALITY_MAP[info.sign],
      dignity: getPlanetDignityStatus(info.name, info.sign),
    };
  });
}

export interface AstroDistribution {
  element: Record<AstroElement, PlanetItem['name'][]>;

  modality: Record<AstroModality, PlanetItem['name'][]>;
}

// 根据 planetList 拿到四系三宫的 map
export function buildDistribution(planetList: PlanetItem[]): AstroDistribution {
  const res = {
    element: ASTRO_ELEMENTS.reduce((r, element) => {
      r[element] = [];
      return r;
    }, {} as Record<AstroElement, PlanetItem['name'][]>),
    modality: ASTRO_MODALITIES.reduce((r, moality) => {
      r[moality] = [];
      return r;
    }, {} as Record<AstroModality, PlanetItem['name'][]>),
  };

  planetList.forEach((p) => {
    res.element[p.element].push(p.name);
    res.modality[p.modality].push(p.name);
  });
  return res;
}

// 判断是否逆行
function isRetrograde(name: BodyInUse, date: Date) {
  // 日月不会逆行
  if (name === Body.Sun || name === Body.Moon) return false;

  const dt = 60 * 60 * 1000; // 一小时

  const lon1 = getPlanetInfo(name, date).longitude;
  const lon2 = getPlanetInfo(name, new Date(date.getTime() + dt)).longitude;

  let diff = lon2 - lon1; // 每小时移动多少度

  // 处理跨360°
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

export enum Aspect {
  Conjunction = 'Conjunction',
  Sextile = 'Sextile',
  Square = 'Square',
  Trine = 'Trine',
  Opposition = 'Opposition', // 冲
  Quincunx = 'Quincunx', // 梅花相位
}

// 相位
export interface AspectItem {
  between: [PlanetItem['name'], PlanetItem['name']];
  type: Aspect;
  angle: string;
  orb: number;
  strength: 'strong' | 'normal';
}
class AspectPosition {
  ASPECTS = [
    { name: Aspect['Conjunction'], title: '合相', angle: 0, orb: 6 },
    { name: Aspect['Sextile'], title: '六合', angle: 60, orb: 3 },
    { name: Aspect['Square'], title: '刑', angle: 90, orb: 5 },
    { name: Aspect['Trine'], title: '三合', angle: 120, orb: 7 },
    { name: Aspect['Opposition'], title: '冲', angle: 180, orb: 5 },
  ];
  // TODO move in ui
  map = {
    [Aspect.Conjunction]: { name: '合相', color: '#ff8549', symbol: '☌' }, // 靛蓝（中性、融合）
    [Aspect.Sextile]: { name: '六合', color: '#40c977', symbol: '⚹' }, // 绿色（和谐、机会）
    [Aspect.Square]: { name: '刑', color: '#f00', symbol: '□' }, // 红色（冲突、张力）
    [Aspect.Trine]: { name: '三合', color: '#00a240', symbol: '△' }, // 蓝色（顺畅、流动）
    [Aspect.Opposition]: { name: '冲', color: '#8046d9', symbol: '☍' }, // 橙色（对立但有连接）
    [Aspect.Quincunx]: { name: '梅花相位', color: '#000', symbol: '' }, // TODO 颜色 symbol 待补充
  };
  // 针对行星使用单独的容许度
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

  // 获取相位数据
  public getData(planets: PlanetItem[]) {
    const aspects: AspectItem[] = [];

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

  // 根据经度获取 x y，坐标原点为左上角，经度为 0 时坐标为 (0, R - r)
  // R 为星盘半径，r 为行星自己轨道的最大半径
  public getPosition(longitude: number, R: number) {
    const r = 0.8 * R; // translateX(-80%)

    // 转弧度 + 偏移 180°
    const rad = ((longitude + 180) * Math.PI) / 180;

    return {
      x: R + r * Math.cos(rad),
      y: R - r * Math.sin(rad),
    };
  }

  // 判断是否命中相位
  private isAspectHit(diff: number, target: number, orb: number) {
    return Math.abs(diff - target) <= orb;
  }

  // 算每 deg/hour
  private getRelativeSpeed(date: Date, b1: PlanetItem['name'], b2: PlanetItem['name']): number {
    const dt = 60 * 60 * 1000;

    const d1 = PairLongitude(b1, b2, date);
    const d2 = PairLongitude(b1, b2, new Date(date.getTime() + dt));

    return this.getAngleDiff(d1, d2); // deg/hour
  }

  // 根据行星获取动态的步长，快行星走的快，慢行星走的慢，优化计算速度
  private getDynamicStepMs(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    target: number,
    orb: number
  ) {
    const speed = this.getRelativeSpeed(date, b1, b2); // deg/hour

    // 防止极小值（外行星）
    const safeSpeed = Math.max(speed, 0.001);

    // 目标：一次移动 ≈ orb 的一小部分（比如 1/5）
    const hours = orb / safeSpeed / 5;

    // 转成 ms
    let step = hours * 3600 * 1000;

    // 加边界限制（很重要）
    const MIN = 5 * 60 * 1000; // 5分钟
    const MAX = 24 * 3600 * 1000; // 24小时

    // 此时的 step 就可以用了
    step = Math.max(MIN, Math.min(MAX, step));

    const diff = PairLongitude(b1, b2, date);
    const distance = Math.abs(diff - target);

    // 越接近相位 → step 越小
    const factor = Math.max(distance / orb, 0.1);
    const newStep = step * factor;

    return Math.max(step, newStep);
  }

  // 找边界（开始 / 结束）
  private findBoundary(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    get: (d: Date) => number,
    target: number,
    orb: number,
    direction: 1 | -1
  ) {
    let t = new Date(date);

    // 动态计算步数
    const stepMs = this.getDynamicStepMs(t, b1, b2, target, orb);

    // 先扫出边界区间
    while (this.isAspectHit(get(t), target, orb)) {
      t = new Date(t.getTime() + direction * stepMs);
    }

    // 二分精确边界
    let t1 = new Date(t.getTime() - direction * stepMs);
    let t2 = t;

    for (let i = 0; i < 20; i++) {
      const mid = new Date((t1.getTime() + t2.getTime()) / 2);
      const hit = this.isAspectHit(get(mid), target, orb);

      if (hit) {
        t1 = mid;
      } else {
        t2 = mid;
      }
    }

    return new Date((t1.getTime() + t2.getTime()) / 2);
  }

  // 找精确相位（exact）
  private findExact(date: Date, get: (d: Date) => number, target: number) {
    let t1 = new Date(date.getTime() - 2 * 24 * 3600 * 1000);
    let t2 = new Date(date.getTime() + 2 * 24 * 3600 * 1000);

    for (let i = 0; i < 25; i++) {
      const mid = new Date((t1.getTime() + t2.getTime()) / 2);

      const d1 = get(t1) - target;
      const dmid = get(mid) - target;

      if (d1 * dmid <= 0) {
        t2 = mid;
      } else {
        t1 = mid;
      }
    }

    return new Date((t1.getTime() + t2.getTime()) / 2);
  }

  // Applying / Separating 入相/出相
  private isApplying(d1: number, d2: number, target: number) {
    return Math.abs(d2 - target) < Math.abs(d1 - target);
  }

  // 找某一个相位的 开始/结束时间
  public findAspectWindow(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    aspect: Aspect
  ) {
    const _now = new Date(); // debug 计算用时
    const get = (d: Date) => PairLongitude(b1, b2, d);

    // TODO 优化 use map
    const item = this.ASPECTS.find((i) => i.name === aspect);

    const target = item!.angle;
    const orb = this.getDynamicOrb(b1, b2, item!.orb);

    const start = this.findBoundary(date, b1, b2, get, target, orb, -1);
    const end = this.findBoundary(date, b1, b2, get, target, orb, +1);
    const exact = this.findExact(date, get, target);

    const _t = Date.now() - _now.getTime(); // debug 用

    return { start, exact, end, _t };
  }
}

export const aspectPosition = new AspectPosition();

// const result = aspectPosition.findAspectWindow(
//   new Date(),
//   Body.Jupiter,
//   Body.Mars,
//   Aspect.Square // 刑相
// );

// console.log(result.start.toLocaleDateString());
// console.log(result.end.toLocaleDateString());
// console.log(result.exact.toLocaleDateString());
