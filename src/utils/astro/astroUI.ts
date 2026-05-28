import { PatternType } from './aspectPattern';
import { AstroElement, AstroModality, BodyInUse, Star } from './constant';
import { DignityStatus } from './dignity';

export const AstroElementMap: Record<AstroElement, { name: string; color: string }> = {
  Fire: { name: '火', color: '#FF5A5F' }, // 火：橙红（行动/能量）
  Earth: { name: '土', color: '#C2B280' }, // 土：橄榄绿（稳定/现实）
  Air: { name: '风', color: '#7BAFD4' }, // 风：清蓝（思维/交流）
  Water: { name: '水', color: '#4A6CF7' }, // 水：靛紫（情绪/直觉）
};

const eColors: Record<AstroElement, string> = {
  Fire: AstroElementMap.Fire.color,
  Earth: AstroElementMap.Earth.color,
  Air: AstroElementMap.Air.color,
  Water: AstroElementMap.Water.color,
};

export const AstroModalityMap: Record<AstroModality, { name: string; color: string }> = {
  Cardinal: { name: '开创', color: '' },
  Fixed: { name: '固定', color: '' },
  Mutable: { name: '变动', color: '' },
};

export const planentsMap: Record<
  BodyInUse,
  { name: string; n?: string; color: string; symbol: string }
> = {
  Sun: { name: '太阳', n: '日', color: eColors.Fire, symbol: '☉' }, // 红色（太阳）
  Moon: { name: '月亮', color: eColors.Water, symbol: '☾' }, // 月光蓝（情绪/柔和）
  Mercury: { name: '水星', color: eColors.Air, symbol: '☿' }, // 青绿色（思维/流动）
  Venus: { name: '金星', color: eColors.Air, symbol: '♀' }, // 粉玫瑰（爱/美感）
  Mars: { name: '火星', color: eColors.Fire, symbol: '♂' }, // 火红（行动力）
  Jupiter: { name: '木星', color: eColors.Fire, symbol: '♃' }, // 紫色（扩张/幸运）
  Saturn: { name: '土星', color: eColors.Earth, symbol: '♄' }, // 深灰蓝（结构/限制）
  Uranus: { name: '天王星', color: eColors.Air, symbol: '♅' }, // 电光青（变革）
  Neptune: { name: '海王星', color: eColors.Water, symbol: '♆' }, // 深海蓝（幻想/灵性）
  Pluto: { name: '冥王星', color: eColors.Water, symbol: '♇' }, // 深紫（转化/深层力量）
};

export const planetTexts: Record<
  BodyInUse,
  {
    short: string;
    long: string;
  }
> = {
  Sun: {
    short: '核心自我、意志、人生方向',
    long: '太阳代表你的核心人格与自我意识，是你主动想成为的样子。它象征生命力、创造力以及人生的主线方向，你如何表达自我、做决定以及追求成就，都与太阳密切相关。',
  },
  Moon: {
    short: '情绪、本能、安全感来源',
    long: '月亮代表你的情绪反应与潜意识，是你最自然、不加防备的一面。它关联安全感、依赖模式以及内在需求，反映你在压力下的真实反应，以及你如何被照顾与如何照顾他人。',
  },
  Mercury: {
    short: '思维、沟通、学习方式',
    long: '水星掌管思考、表达与信息处理方式。它决定你如何学习、分析问题以及与他人沟通交流，也体现你的语言风格、逻辑能力和对细节的关注程度。',
  },
  Venus: {
    short: '关系、审美、价值与吸引力',
    long: '金星象征爱与连接，反映你如何建立关系、表达情感以及欣赏美。它也代表你的价值观和吸引力，揭示你喜欢什么样的人、如何相处以及在关系中追求的体验。',
  },
  Mars: {
    short: '行动力、欲望、冲突与驱动力',
    long: '火星代表行动与欲望，是推动你前进的原始动力。它体现你的竞争方式、愤怒表达以及面对挑战时的反应，也关系到你的执行力与冲突处理方式。',
  },
  Jupiter: {
    short: '扩张、机遇、信念与成长',
    long: '木星象征扩展与成长，代表机遇、信念以及对意义的追寻。它显示你在哪些领域容易获得发展与好运，以及你如何理解世界、建立价值体系。',
  },
  Saturn: {
    short: '限制、责任、结构与课题',
    long: '土星代表现实的限制与责任，是人生中的考验与结构来源。它揭示你需要面对的挑战、建立的边界以及通过努力获得的长期成果，也是成熟与稳定的关键。',
  },
  Uranus: {
    short: '变化、独立、突破与觉醒',
    long: '天王星象征突变与创新，代表你追求自由与独立的方式。它带来打破常规的冲动、意外变化以及觉醒的契机，推动你走出旧有模式。',
  },
  Neptune: {
    short: '理想、直觉、模糊与想象',
    long: '海王星代表理想与感知的边界，关联直觉、想象力与精神层面。它既能带来灵感与共情，也可能导致迷茫、逃避或过度理想化。',
  },
  Pluto: {
    short: '转化、控制、深层力量与重生',
    long: '冥王星象征深层的转化与重生力量，关联控制、极端经验以及心理深处的变化。它推动你经历彻底的改变，从而获得更强的内在力量。',
  },
};

export const map12: Record<Star, { name: string; n: string; icon: string; color: string }> = {
  [Star.Aries]: {
    name: '白羊座',
    n: '羊',
    icon: '♈',
    color: eColors.Fire,
  },
  [Star.Taurus]: {
    name: '金牛座',
    n: '牛',
    icon: '♉',
    color: eColors.Earth,
  },
  [Star.Gemini]: {
    name: '双子座',
    n: '双',
    icon: '♊',
    color: eColors.Air,
  },
  [Star.Cancer]: {
    name: '巨蟹座',
    n: '蟹',
    icon: '♋',
    color: eColors.Water,
  },
  [Star.Leo]: { name: '狮子座', n: '狮', icon: '♌', color: eColors.Fire },
  [Star.Virgo]: {
    name: '处女座',
    n: '处',
    icon: '♍',
    color: eColors.Earth,
  },
  [Star.Libra]: { name: '天秤座', n: '秤', icon: '♎', color: eColors.Air },
  [Star.Scorpio]: {
    name: '天蝎座',
    n: '蝎',
    icon: '♏',
    color: eColors.Water,
  },
  [Star.Sagittarius]: {
    name: '射手座',
    n: '射',
    icon: '♐',
    color: eColors.Fire,
  },
  [Star.Capricorn]: {
    name: '摩羯座',
    n: '摩',
    icon: '♑',
    color: eColors.Earth,
  },
  [Star.Aquarius]: {
    name: '水瓶座',
    n: '瓶',
    icon: '♒',
    color: eColors.Air,
  },
  [Star.Pisces]: {
    name: '双鱼座',
    n: '鱼',
    icon: '♓',
    color: eColors.Water,
  },
};

export const title12 = [
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

const signTexts: Record<Star, { short: string; style: string }> = {
  [Star.Aries]: { short: '直接、冲动', style: '以行动为导向，快速反应' },
  [Star.Taurus]: { short: '稳定、务实', style: '重视安全与实际体验' },
  [Star.Gemini]: { short: '多变、好奇', style: '通过交流与信息建立连接' },
  [Star.Cancer]: { short: '敏感、保护', style: '以情感与安全感为中心' },
  [Star.Leo]: { short: '表达、自信', style: '渴望被看见与认可' },
  [Star.Virgo]: { short: '细致、分析', style: '通过优化与改进获得掌控感' },
  [Star.Libra]: { short: '平衡、关系', style: '关注互动与和谐' },
  [Star.Scorpio]: { short: '深刻、极端', style: '追求深层连接与控制' },
  [Star.Sagittarius]: { short: '探索、自由', style: '寻找意义与更大视野' },
  [Star.Capricorn]: { short: '现实、责任', style: '以目标与成就为导向' },
  [Star.Aquarius]: { short: '独立、创新', style: '强调个体与群体的突破' },
  [Star.Pisces]: { short: '感性、融合', style: '倾向于共情与想象' },
};

export const patternMap = {
  [PatternType.GrandTrine]: {
    text: '大三角',
    color: '#4CAF50', // 和谐的绿色
    desc: '天赋异禀，能量循环顺畅，但需防惰性。',
  },
  [PatternType.Kite]: {
    text: '风筝',
    color: '#00BCD4', // 稀有且和谐的青蓝色
    desc: '在大三角基础上增加驱动力，易将天赋转化为成就。',
  },
  [PatternType.TSquare]: {
    text: 'T三角',
    color: '#FF5722', // 不和谐/高张力的橙红色
    desc: '充满挑战与磨难，是磨练意志、爆发成功的强力引擎。',
  },
  [PatternType.GrandCross]: {
    text: '大十字',
    color: '#D32F2F', // 极端不和谐的深红色
    desc: '极为罕见且压力巨大，人生波折多，但成就亦非凡。',
  },
  [PatternType.MysticRectangle]: {
    text: '神秘矩形',
    color: '#FFD700', // 代表才华与平衡的金色
    desc: '极佳的整合能力，擅长将矛盾转化为平衡的才华。',
  },
  // [PatternType.Yod]: {
  //   text: '上帝之指',
  //   color: '#9C27B0', // 神秘且稀有的紫色
  //   desc: '宿命般的指引，需不断调整自我以达成特殊使命。',
  // },
};

export const DignityMap: Record<DignityStatus, { color: string; text: string }> = {
  Domicile: { text: '庙', color: '#67c23a' }, // 强能量（绿色）
  Exaltation: { text: '旺', color: '#409eff' }, // 较强（蓝色）
  Detriment: { text: '失势', color: '#e6a23c' }, // 弱化（橙色）
  Fall: { text: '落陷', color: '#f56c6c' }, // 极弱（红色）
  Peregrine: { text: '', color: '#909399' }, // 中性（灰色）
};

export function generateInterpretation(p: BodyInUse, s: Star): string {
  const planet = planetTexts[p];
  const sign = signTexts[s];
  // const house = houseTexts[p.house];

  const pName = planentsMap[p].name;
  const signName = map12[s].name;

  // ，第${p.house}宫。
  // 这种能量主要体现在「${house}」这一领域。

  return `
你的${pName}落在${signName}。

这意味着：你的「${planet.short}」会以一种「${sign.short}」的方式表现，
通常呈现为：${sign.style}。

进一步来说，${planet.long}
在这个位置上，你往往会在该领域中，以这种方式不断发展与体验。
  `.trim();
}
