import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const body = await req.json();

  const messages = await convertToModelMessages(body.messages);

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
