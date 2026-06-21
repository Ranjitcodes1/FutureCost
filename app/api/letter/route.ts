import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildLetterPrompt } from '@/lib/ai/letterPrompt';
import { LetterRequest } from '@/lib/carbon/types';
import { createClient } from '@/lib/supabase/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response('GEMINI_API_KEY is not configured', { status: 500 });
    }

    const body: LetterRequest = await request.json();
    const prompt = buildLetterPrompt(body);

    const supabase = await createClient();
    let simulationId = body.simulationId;

    // Create a simulation record if we don't have one
    if (!simulationId) {
      const { data, error } = await supabase.from('simulations').insert({
        decision_type: body.comparison.optionA.option.decisionType,
        option_a: body.comparison.optionA,
        option_b: body.comparison.optionB,
        chosen_option: body.chosenTrajectory,
      }).select('id').single();
      
      if (!error && data) {
        simulationId = data.id;
      }
    }

    const encoder = new TextEncoder();
    let fullLetter = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              fullLetter += chunk.text;
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          
          // Save letter after completion
          if (simulationId) {
            await supabase.from('letters').insert({
              simulation_id: simulationId,
              chosen_trajectory: body.chosenTrajectory,
              tone: body.tone,
              letter_text: fullLetter
            });
          }
          
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Transfer-Encoding', 'chunked');
    headers.set('X-Content-Type-Options', 'nosniff');
    
    if (simulationId) {
      headers.set('X-Simulation-Id', simulationId);
    }

    return new Response(stream, { headers });
  } catch (error) {
    console.error('Letter generation error:', error);
    return new Response('Letter generation failed', { status: 500 });
  }
}
