import { getThemeColorByAstro } from './astro';

// 中文版本的排序
function sortByZh(a: string, b: string, isSortUp: boolean) {
  return isSortUp ? a.localeCompare(b) : b.localeCompare(a);
}
export function sortByZhKey(key: string) {
  return (a: Record<string, string>, b: Record<string, string>, isSortUp: boolean) =>
    sortByZh(a[key], b[key], isSortUp);
}

/**
 * 应用全局主题色
 * @param {string} color
 */
export function applyThemeColor() {
  const themeColor = getThemeColorByAstro();

  // 将颜色写入到 html 根节点上，生成全局 CSS 变量
  document.documentElement.style.setProperty('--global-theme-color', themeColor);

  console.log(`[Theme] 当前主题色已更新为: ${themeColor}`);
}
