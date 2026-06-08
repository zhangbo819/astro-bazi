// api/ascendant.ts
import { Horoscope } from 'astrology-js';

// 中文星座映射表
const CONSTELLATION_MAP: Record<string, string> = {
  Aries: '白羊座',
  Taurus: '金牛座',
  Gemini: '双子座',
  Cancer: '巨蟹座',
  Leo: '狮子座',
  Virgo: '处女座',
  Libra: '天秤座',
  Scorpio: '天蝎座',
  Sagittarius: '射手座',
  Capricorn: '摩羯座',
  Aquarius: '水瓶座',
  Pisces: '双鱼座',
};

export default async function handler(req: Request) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    // 从前端接收标准的出生参数
    // birthTime 格式示例: "1995-10-24T14:30:00" (当地时间)
    const { birthTime, longitude, latitude } = await req.json();

    if (!birthTime || !longitude || !latitude) {
      return new Response(
        JSON.stringify({ error: '缺少必要的出生参数(birthTime, longitude, latitude)' }),
        { status: 400 }
      );
    }

    // 1. 初始化星盘实例
    const horoscope = new Horoscope({
      time: new Date(birthTime),
      settings: {
        longitude: parseFloat(longitude), // 经度，例如：上海 121.47
        latitude: parseFloat(latitude), // 纬度，例如：上海 31.23
      },
    });

    // 2. 调用算法，获取上升点 (Ascendant)
    const ascendantData = horoscope.getAscendant();

    // 3. 提取英文星座名并翻译成中文
    const englishSign = ascendantData.sign; // 例如 "Scorpio"
    const chineseSign = CONSTELLATION_MAP[englishSign] || englishSign;

    // 4. 计算在当前星座内的精确度数（30度制）
    const preciseDegree = ascendantData.degree.toFixed(2);

    // 返回格式化的干净 JSON 数据给前端
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ascendantSign: chineseSign, // "天蝎座"
          ascendantSignEn: englishSign, // "Scorpio"
          degreeInSign: `${preciseDegree}°`, // "14.25°"
          raw: ascendantData, // 保留原始黄道经度等数据备用
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('上升星座计算失败:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || '内部计算错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
