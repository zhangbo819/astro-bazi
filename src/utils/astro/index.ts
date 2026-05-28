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
