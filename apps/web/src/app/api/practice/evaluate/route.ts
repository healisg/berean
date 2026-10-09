import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EVALUATOR_PROMPT = `You are Berean, an expert Christian apologetics coach. A Christian has just completed a practice debate session against an AI playing the role of a Jehovah's Witness. Review the full conversation and provide coaching feedback.

Your evaluation must include:
1. A score out of 10 for overall apologetic effectiveness
2. The single strongest argument or moment from the Christian's responses
3. Up to 3 specific gaps, missed opportunities, or weak responses — with the exact moment it happened
4. For each gap, a concrete example of what they could have said instead
5. One focus area to work on before the next session

Tone: Like a knowledgeable, encouraging coach — direct but not harsh. This person is growing.

Return your response as valid JSON only, no markdown fences:
{
  "score": 7,
  "scoreLabel": "Solid — a few key gaps to close",
  "strongestMoment": "...",
  "gaps": [
    {
      "moment": "When they said '...'",
      "issue": "...",
      "betterResponse": "..."
    }
  ],
  "focusArea": "..."
}`;

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || history.length < 2) {
      return NextResponse.json({ error: 'Not enough conversation to evaluate.' }, { status: 400 });
    }

    const transcript = history
      .map((m: { role: string; content: string }) =>
        `${m.role === 'user' ? 'Christian' : 'JW'}: ${m.content}`
      )
      .join('\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: EVALUATOR_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here is the practice conversation to evaluate:\n\n${transcript}`,
        },
      ],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    // Extract JSON object from the response regardless of surrounding text or fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Evaluate: no JSON object found in response:', raw);
      return NextResponse.json({ error: 'Could not parse evaluation.' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Evaluate error:', err);
    return NextResponse.json({ error: 'Could not evaluate session.' }, { status: 500 });
  }
}
