import { TG, DZ, Ten, ZhangSheng, ShenshaItem } from 'astro-bazi-utils';

// 暂时放这 之后放到库里
export enum PillarTitle {
  年柱 = '年柱',
  月柱 = '月柱',
  日柱 = '日柱',
  时柱 = '时柱',
  大运 = '大运',
  流年 = '流年',
  流月 = '流月',
  流日 = '流日',
  流时 = '流时',
}

export type PillarItem = {
  title: string;
  isShow: boolean;
  zhuxing: Ten;
  tg: TG;
  dz: DZ;
  dzcg: string[];
  fx: number[];
  fx_text: string[]; // 新增 UI 渲染
  xingyun: ZhangSheng | null;
  zizuo: ZhangSheng | null;
  nayin: string;
  ss: ShenshaItem[];
};

export const Sizhu = [PillarTitle.年柱, PillarTitle.月柱, PillarTitle.日柱, PillarTitle.时柱];
