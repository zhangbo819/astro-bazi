import anhui from "./anhui.json";
import aomen from "./aomen.json";
import beijing from "./beijing.json";
import chongqing from "./chongqing.json";
import fujian from "./fujian.json";
import gansu from "./gansu.json";
import guangdong from "./guangdong.json";
import guangxi from "./guangxi.json";
import guizhou from "./guizhou.json";
import hainan from "./hainan.json";
import hebei from "./hebei.json";
import heilongjiang from "./heilongjiang.json";
import henan from "./henan.json";
import hubei from "./hubei.json";
import hunan from "./hunan.json";
import jiangsu from "./jiangsu.json";
import jiangxi from "./jiangxi.json";
import jilin from "./jilin.json";
import liaoning from "./liaoning.json";
import neimenggu from "./neimenggu.json";
import ningxia from "./ningxia.json";
import qinghai from "./qinghai.json";
import shandong from "./shandong.json";
import shanghai from "./shanghai.json";
import shanxi from "./shanxi.json";
import shanxi1 from "./shanxi1.json";
import sichuan from "./sichuan.json";
import tianjin from "./tianjin.json";
import xianggang from "./xianggang.json";
import xinjiang from "./xinjiang.json";
import xizang from "./xizang.json";
import yunnan from "./yunnan.json";
import zhejiang from "./zhejiang.json";

const map: Record<string | number, any> = {
  anhui,
  aomen,
  beijing,
  chongqing,
  fujian,
  gansu,
  guangdong,
  guangxi,
  guizhou,
  hainan,
  hebei,
  heilongjiang,
  henan,
  hubei,
  hunan,
  jiangsu,
  jiangxi,
  jilin,
  liaoning,
  neimenggu,
  ningxia,
  qinghai,
  shandong,
  shanghai,
  shanxi,
  shanxi1,
  sichuan,
  tianjin,
  xianggang,
  xinjiang,
  xizang,
  yunnan,
  zhejiang,
};
export function getProvinceData(provinceName: string | number) {
  return map[provinceName];
}
