import { Body } from 'astronomy-engine';

export const BODIES = [
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
] as const;

export type BodyInUse = (typeof BODIES)[number];

export enum Star {
  'Aries' = 'Aries',
  'Taurus' = 'Taurus',
  'Gemini' = 'Gemini',
  'Cancer' = 'Cancer',
  'Leo' = 'Leo',
  'Virgo' = 'Virgo',
  'Libra' = 'Libra',
  'Scorpio' = 'Scorpio',
  'Sagittarius' = 'Sagittarius',
  'Capricorn' = 'Capricorn',
  'Aquarius' = 'Aquarius',
  'Pisces' = 'Pisces',
}

// 古典七曜
// const ClassicalPlanent = [
//   Body.Sun,
//   Body.Moon,
//   Body.Mercury,
//   Body.Venus,
//   Body.Mars,
//   Body.Jupiter,
//   Body.Saturn,
// ] as const;
// type ClassicalPlanentType = (typeof ClassicalPlanent)[number];

// 现代三王星
// const ModernPlanent = [Body.Uranus, Body.Neptune, Body.Pluto] as const;
// type ModernPlanentType = (typeof ModernPlanent)[number];

// 四系
export const ASTRO_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'] as const;

export type AstroElement = (typeof ASTRO_ELEMENTS)[number];

const ELEMENT_SIGNS_MAP: Record<AstroElement, Star[]> = {
  Fire: [Star.Aries, Star.Leo, Star.Sagittarius],

  Earth: [Star.Taurus, Star.Virgo, Star.Capricorn],

  Air: [Star.Gemini, Star.Libra, Star.Aquarius],

  Water: [Star.Cancer, Star.Scorpio, Star.Pisces],
};
// 星座为 key，值为四系
export const SIGN_ELEMENT_MAP = Object.fromEntries(
  Object.entries(ELEMENT_SIGNS_MAP).flatMap(([element, signs]) =>
    signs.map((sign) => [sign, element])
  )
) as Record<Star, AstroElement>;

// 三模式
export const ASTRO_MODALITIES = ['Cardinal', 'Fixed', 'Mutable'] as const;

export type AstroModality = (typeof ASTRO_MODALITIES)[number];

const MODALITY_SIGNS_MAP: Record<AstroModality, Star[]> = {
  Cardinal: [Star.Aries, Star.Cancer, Star.Libra, Star.Capricorn],

  Fixed: [Star.Taurus, Star.Leo, Star.Scorpio, Star.Aquarius],

  Mutable: [Star.Gemini, Star.Virgo, Star.Sagittarius, Star.Pisces],
};
// 星座为 key，值为三模式
export const SIGN_MODALITY_MAP = Object.fromEntries(
  Object.entries(MODALITY_SIGNS_MAP).flatMap(([modality, signs]) =>
    signs.map((sign) => [sign, modality])
  )
) as Record<Star, AstroModality>;
