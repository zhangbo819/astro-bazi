import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const data = await req.json();

  const result = await generateText({
    model: google('gemini-2.5-flash'),

    prompt: `
你是专业西洋占星师。

以下是JSON格式本命盘：

${JSON.stringify(data)}

请输出：

# 核心人格
# 情绪模式
# 行动力
# 人际关系
# 成长方向

使用中文。
`,
  });

  return Response.json({
    text: result.text,
  });
}
