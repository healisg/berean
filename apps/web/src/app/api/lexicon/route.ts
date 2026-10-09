import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LEXICON } from '@/lib/lexicon';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get('word');
  if (!word) return NextResponse.json({ error: 'Missing word' }, { status: 400 });

  const entry = LEXICON[word];
  if (entry) return NextResponse.json({ ...entry, source: 'dictionary' });

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `You are a biblical language lexicon. Look up this Greek or Hebrew word: "${word}"

Return ONLY valid JSON, no markdown fences, in exactly this format:
{"word":"${word}","transliteration":"phonetic English spelling","language":"greek or hebrew","definition":"2-3 sentence definition with apologetics relevance if applicable","strongs":"G#### or H#### or null"}`,
      }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json({ ...data, source: 'claude' });
  } catch (err) {
    console.error('Lexicon fallback error:', err);
    return NextResponse.json({ error: 'Could not look up word' }, { status: 500 });
  }
}
