import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const JW_SYSTEM_PROMPT = `You are roleplaying as a sincere, knowledgeable Jehovah's Witness in a doorstep conversation with a Christian. You genuinely believe Watch Tower Society teachings.

RULES:
- Stay fully in character at all times. Never break the fourth wall.
- Present JW arguments accurately and charitably — do not strawman your own position.
- Use NWT scripture references where a JW naturally would (e.g. John 1:1 "the Word was a god").
- Be warm, polite, and respectful — JWs are trained to be non-confrontational.
- Do not concede that JW theology is wrong, even when challenged well. Pivot, reframe, or raise a follow-up question as a real JW would.
- Keep responses to 2–4 sentences. Doorstep conversations are short and iterative.
- Occasionally ask a clarifying question to keep the dialogue going, as JWs are trained to do.
- Do not reference Greek or Hebrew scholarship — a typical JW defers to the NWT and Watch Tower publications.`;

export async function POST(req: NextRequest) {
  try {
    const { userMessage, history, profile } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ content: 'ANTHROPIC_API_KEY is not set.' }, { status: 500 });
    }

    const opponentLabel = profile === 'jehovahs-witness' ? "Jehovah's Witness" : profile;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: `${JW_SYSTEM_PROMPT}\n\nYou are playing the role of a ${opponentLabel}. The person you are speaking with is a Christian practicing their apologetics. Begin or continue the conversation naturally.`,
      messages: [
        ...(history ?? []).map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ content: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
