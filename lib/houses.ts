import { Body } from 'astronomy-engine';
// Swiss Ephemeris 完整占星系统 只能用于服务端
import swisseph from 'swisseph';
import { getAllPlanets, isRetrograde, SIGNS } from './planets';

type Houses = {
  ascendant: number;
  mc: number;
  houses: number[];
};

enum FOUR_AXIS {
  ASC = 'ASC',
  DSC = 'DSC',
  MC = 'MC',
  IC = 'IC',
}

interface PlanetHouseItem {
  name: Body | FOUR_AXIS;
  house: number | undefined;
  sign: string;
  degree: number;
  longitude: number;
  retrograde?: boolean;
}

// 宫位
class PlanetsHouses {
  // 拿到宫位详情
  private getHouses(date: Date, lat: number, lon: number): Houses {
    // 转 Julian Day
    const jd = swisseph.swe_julday(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours() + date.getUTCMinutes() / 60,
      swisseph.SE_GREG_CAL
    );

    // Placidus 分宫
    const result = swisseph.swe_houses(
      jd,
      lat,
      lon,
      'P' // Placidus
    );

    if ('error' in result) {
      throw new Error(result.error);
    }

    return {
      ascendant: result.ascendant, // 上升点黄经
      mc: result.mc, // 天顶
      houses: result.house, // 12宫起点
    };
  }

  private _getHouseIndex(lon: number, houses: number[]) {
    for (let i = 0; i < 12; i++) {
      const start = houses[i];
      const end = houses[(i + 1) % 12];

      if (start < end) {
        if (lon >= start && lon < end) return i + 1;
      } else {
        // 跨360°
        if (lon >= start || lon < end) return i + 1;
      }
    }
  }

  private toUTC(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    tzOffset: number
  ) {
    return new Date(Date.UTC(year, month, day, hour - tzOffset, minute));
  }

  private getAngles(houseData: Houses) {
    const asc = houseData.ascendant;
    const mc = houseData.mc;

    function _normalize(deg: number) {
      return (deg + 360) % 360;
    }

    return {
      [FOUR_AXIS.ASC]: asc,
      [FOUR_AXIS.DSC]: _normalize(asc + 180),
      [FOUR_AXIS.MC]: mc,
      [FOUR_AXIS.IC]: _normalize(mc + 180),
    };
  }

  private _formatPosition(lon: number) {
    return {
      longitude: lon,
      sign: SIGNS[Math.floor(lon / 30)],
      degree: +(lon % 30).toFixed(2),
    };
  }

  // 获取整体数据
  // tzOffset 当前时区 北京 8 日本 9
  public getData(date: Date, tzOffset = -new Date().getTimezoneOffset() / 60) {
    const dateUTC = this.toUTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      tzOffset
    );

    // TODO 经纬度
    const Lat_Lon = {
      beijing: { lat: 35.68, lon: 116.4 }, // 北京
      shuangyashan: { lat: 46.64, lon: 131.15 }, // 双鸭山
      chiba: { lat: 35.623533, lon: 140.15712 }, // 千叶
    };

    const planets = getAllPlanets(dateUTC);
    const houseData = this.getHouses(dateUTC, Lat_Lon.chiba.lat, Lat_Lon.chiba.lon);
    // console.log("getData houseData", houseData);

    const data: PlanetHouseItem[] = planets.map((p) => ({
      ...p,
      house: this._getHouseIndex(p.longitude, houseData.houses),
      retrograde: isRetrograde(p.name, date),
    }));

    // 四轴
    const angles = this.getAngles(houseData);
    const formattedAngles: PlanetHouseItem[] = Object.entries(angles).map(([key, lon]) => {
      const { longitude, ...rest } = this._formatPosition(lon);

      return {
        name: key as FOUR_AXIS,
        longitude,
        ...rest,
        house: this._getHouseIndex(longitude, houseData.houses),
      };
    });

    return {
      houseData,
      planets: data,
      angles: formattedAngles,
    };
  }
}

export const planetsHouses = new PlanetsHouses();
