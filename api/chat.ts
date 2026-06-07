import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const body = await req.json();

  console.log('body:', body);
  console.log('messages:', body.messages);
  console.log('isArray:', Array.isArray(body.messages));

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(body.messages),
  });

  return result.toUIMessageStreamResponse();
}
