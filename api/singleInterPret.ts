import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const data = await req.json();

  const prompt = `
你是一位专业的心理占星师，讲讲这个落座配置

${JSON.stringify(data, null, 2)}

`;

  const result = await generateText({
    model: google('gemini-2.5-flash-lite'),

    prompt,
  });

  return Response.json({
    text: result.text,
  });
}
