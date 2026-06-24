import { map12 } from './astroUI';
import { BODIES } from './constant';
import { getPlanetInfo } from './planets';

/**
 * 获取对应的主题色
 * @returns {string} 颜色哈希值
 */
export function getThemeColorByAstro() {
  const { sign } = getPlanetInfo(BODIES[0], new Date());
  const color = map12[sign].color;
  return color || '#f00'; // 兜底默认色
}

export function mixHexColors(color1: string, color2: string, weight: number = 0.5) {
  // 解析颜色字符串为RGB值
  function parseColor(color: string) {
    const hex = color.replace(/^#/, '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return { r, g, b };
  }

  const color1RGB = parseColor(color1);
  const color2RGB = parseColor(color2);

  // 计算混合后的RGB值
  const blendedR = Math.round((1 - weight) * color1RGB.r + weight * color2RGB.r);
  const blendedG = Math.round((1 - weight) * color1RGB.g + weight * color2RGB.g);
  const blendedB = Math.round((1 - weight) * color1RGB.b + weight * color2RGB.b);

  // 将RGB值转换为十六进制颜色字符串
  function componentToHex(c: number) {
    const hex = c.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  return `#${componentToHex(blendedR)}${componentToHex(blendedG)}${componentToHex(blendedB)}`;
}
