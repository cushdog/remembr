import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('API route hit');
  console.log(process.env.OPENAI_API_KEY);
  
  const { messages } = await req.json();
  console.log('Received messages:', messages);

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const stream = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const data = encoder.encode(`data: ${JSON.stringify({ content })}\n\n`);
            controller.enqueue(data);
          }
        }

        const doneMessage = encoder.encode('data: [DONE]\n\n');
        controller.enqueue(doneMessage);
        controller.close();
      } catch (error) {
        console.error('Error in chat API:', error);
        const errorMessage = encoder.encode(`data: ${JSON.stringify({ error: 'An error occurred while processing your request'})}\n\n`);
        controller.enqueue(errorMessage);
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
