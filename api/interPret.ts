import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const data = await req.json();

  const prompt = `
你是一位专业的心理占星师，根据下面的星盘数据进行解读。

请基于以下星盘数据进行解读：

${JSON.stringify(data, null, 2)}

`;

  // ---

  // ## 解读要求（非常重要）：

  // ### 1. 必须抓“核心矛盾结构”
  // 不要逐个行星解释，要找：
  // - 性格冲突点（例如：理性 vs 情绪）
  // - 行动模式矛盾（例如：想稳定但行动冲动）
  // - 关系模式张力

  // ### 2. 只挑“3-5个关键行星”
  // 优先级：
  // 1. 太阳（月亮）
  // 2. 上升（如果有）
  // 3. 火星（金星）
  // 4. 明显受伤/强化的行星（dignity / detriment / fall / exaltation）
  // 5. 逆行行星（retrograde）

  // 其他行星只作为补充，不要逐个解释。

  // ### 3. 输出结构必须是：

  // # 一、核心人格主轴（一句话总结）
  // # 二、内在情绪与安全感（月亮重点）
  // # 三、行动与欲望模式（火星重点）
  // # 四、关系与吸引模式（金星重点）
  // # 五、主要人生冲突（必须总结2-3个矛盾）
  // # 六、成长建议（现实可执行）

  // ---

  // ## 风格要求：
  // - 不要占星术语堆砌
  // - 不要逐行解释星体
  // - 要像“心理分析报告”
  // - 语言自然、有洞察力
  // - 避免玄学口吻，偏心理学表达

  const result = await generateText({
    model: google('gemini-2.5-flash-lite'),

    prompt,
  });

  return Response.json({
    text: result.text,
  });
}
