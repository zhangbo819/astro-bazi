import { Body } from 'astronomy-engine';
import { BodyInUse, Star } from './constant';

/** 行星庙旺落陷状态 */
interface DignityData {
  domicile: Star[]; // 入庙
  exaltation?: Star; // 旺相
  detriment?: Star[]; // 失势
  fall?: Star; // 落陷
}

/**
 * 10 行星庙旺落陷核心配置表
 * 包含古典 7 星 + 现代 3 王星
 */
const PLANET_DIGNITIES: Record<BodyInUse, DignityData> = {
  [Body.Sun]: {
    domicile: [Star.Leo],
    exaltation: Star.Aries,
    detriment: [Star.Aquarius],
    fall: Star.Libra,
  },
  [Body.Moon]: {
    domicile: [Star.Cancer],
    exaltation: Star.Taurus,
    detriment: [Star.Capricorn],
    fall: Star.Scorpio,
  },
  [Body.Mercury]: {
    domicile: [Star.Gemini, Star.Virgo],
    exaltation: Star.Aquarius, // 水星的旺位在古典是处女，在现代是水瓶，考虑到水瓶座更契合AI和目前冥王也在水瓶，这里使用水瓶
    detriment: [Star.Sagittarius, Star.Pisces],
    fall: Star.Pisces,
  },
  [Body.Venus]: {
    domicile: [Star.Taurus, Star.Libra],
    exaltation: Star.Pisces,
    detriment: [Star.Scorpio, Star.Aries],
    fall: Star.Virgo,
  },
  [Body.Mars]: {
    domicile: [Star.Aries, Star.Scorpio],
    exaltation: Star.Capricorn,
    detriment: [Star.Libra, Star.Taurus],
    fall: Star.Cancer,
  },
  [Body.Jupiter]: {
    domicile: [Star.Sagittarius, Star.Pisces],
    exaltation: Star.Cancer,
    detriment: [Star.Gemini, Star.Virgo],
    fall: Star.Capricorn,
  },
  [Body.Saturn]: {
    domicile: [Star.Capricorn, Star.Aquarius],
    exaltation: Star.Libra,
    detriment: [Star.Cancer, Star.Leo],
    fall: Star.Aries,
  },
  // 三王星在现代占星中争议比较大，这里仅保留争议最小、最稳定的版本
  [Body.Uranus]: {
    domicile: [Star.Aquarius],
    // exaltation: Star.Virgo,
    // detriment: [Star.Leo],
    // fall: null,
  },
  [Body.Neptune]: {
    domicile: [Star.Pisces],
    exaltation: Star.Cancer, // 现代占星常用设定
    detriment: [Star.Virgo],
    fall: Star.Capricorn,
  },
  [Body.Pluto]: {
    domicile: [Star.Scorpio],
    // exaltation: Star.Leo,
    detriment: [Star.Taurus],
    // fall: Star.Aquarius,
  },
};

export type DignityStatus = 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine';

/**
 * 获取行星在特定星座下的尊贵状态
 */
export function getPlanetDignityStatus(planet: BodyInUse, currentSign: Star): DignityStatus {
  const data = PLANET_DIGNITIES[planet];

  // 1. 检查入庙
  if (data.domicile.includes(currentSign)) {
    return 'Domicile';
  }

  // 2. 检查旺相
  if (data.exaltation === currentSign) {
    return 'Exaltation';
  }

  // 3. 检查失势
  if (Array.isArray(data.detriment) && data.detriment.includes(currentSign)) {
    return 'Detriment';
  }

  // 4. 检查落陷
  if (data.fall === currentSign) {
    return 'Fall';
  }

  // 5. 既无尊贵也无受损（游走状态）
  return 'Peregrine';
}
