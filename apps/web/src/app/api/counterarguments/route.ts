import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Berean, an AI coach for Christian apologists. Your task is to predict the follow-up objections a Jehovah's Witness will raise in response to what the user just said — then equip the user to handle each one.

You are not roleplaying the JW. You are coaching the apologist by helping them see what is coming next and how to respond.

Your analysis must be:
- Grounded in how Jehovah's Witnesses are actually trained to respond (Watchtower reasoning patterns, go-to scriptures, NWT appeal, "pagan origin" arguments, etc.)
- Honest about the strongest objections — do not give easy or weak objections
- Practically useful — the user may be mid-conversation and needs help right now

Output format: a JSON array of 3–4 objects. Each object has exactly three fields: "objection", "why", "response". Output nothing else.`;

const levelInstructions: Record<string, string> = {
  beginner: `The user is a beginner. For each objection:
- State the objection in plain, everyday language as the JW would actually say it
- Keep "why" to one short sentence
- Give a response that is simple, short, and something they can actually say out loud right now
- Avoid jargon; if a theological word is unavoidable, briefly define it
- Limit the response to 2–3 sentences`,

  moderate: `The user has moderate experience. For each objection:
- State the objection clearly, including any scripture the JW typically cites
- Explain in "why" why this is a standard Watchtower counter at this point
- Give a response with 2–3 structured points, including a specific scripture reference and brief Greek/Hebrew note where relevant
- End the response with a follow-up question they can direct back at the JW`,

  experienced: `The user is an experienced apologist. For each objection:
- State the objection with precision, including the specific NWT rendering or Watchtower publication logic where applicable
- In "why", identify the precise theological or logical move being made
- Give a dense, exegetically strong response — cite Greek/Hebrew terms directly, reference church fathers or councils where applicable, identify the fallacy in the JW position
- Assume the user will expand the points themselves; be concise and technical`,
};

// Prefill string: force Claude to begin mid-JSON so there is no preamble or markdown fence
const PREFILL = '{"objections":[';

/** Escape unescaped control characters inside JSON string values. */
function fixControlChars(json: string): string {
  let out = '';
  let inStr = false;
  let esc = false;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (esc) { out += ch; esc = false; continue; }
    if (ch === '\\' && inStr) { out += ch; esc = true; continue; }
    if (ch === '"') { inStr = !inStr; out += ch; continue; }
    if (inStr && ch.charCodeAt(0) < 0x20) {
      // Escape any bare control character that would make JSON invalid
      switch (ch) {
        case '\n': out += '\\n'; break;
        case '\r': out += '\\r'; break;
        case '\t': out += '\\t'; break;
        default:   out += `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`; break;
      }
      continue;
    }
    out += ch;
  }
  return out;
}

/** Walk forward from index 0 counting braces to find the matching closing }. */
function findJsonEnd(json: string): number {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

export async function POST(req: NextRequest) {
  try {
    const { statement, level } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set.' }, { status: 500 });
    }
    if (!statement?.trim()) {
      return NextResponse.json({ error: 'No statement provided.' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: levelInstructions[level] ?? levelInstructions.beginner, cache_control: { type: 'ephemeral' } },
      ] as Parameters<typeof client.messages.create>[0]['system'],
      messages: [
        {
          role: 'user',
          content: `The apologist just said this to the Jehovah's Witness:\n\n"${statement.trim()}"\n\nWhat are the 3–4 strongest follow-up objections the JW will raise next?`,
        },
        // Prefill forces Claude to start outputting JSON immediately — no fences, no prose
        {
          role: 'assistant',
          content: PREFILL,
        },
      ],
    });

    const continuation = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const fullJson = PREFILL + continuation;

    // Fix unescaped control characters, then extract the complete JSON object
    const fixed = fixControlChars(fullJson);
    const end = findJsonEnd(fixed);
    if (end === -1) {
      return NextResponse.json({
        error: `No closing brace found. continuation_len=${continuation.length}, fullJson_start=${fullJson.slice(0, 300)}, fullJson_end=${fullJson.slice(-200)}`,
      }, { status: 500 });
    }

    const parsed = JSON.parse(fixed.slice(0, end + 1)) as { objections?: unknown[] };
    if (!Array.isArray(parsed.objections)) {
      return NextResponse.json({ error: 'No objections array in response.' }, { status: 500 });
    }

    return NextResponse.json({ objections: parsed.objections });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = (err as { status?: number })?.status ?? 500;
    console.error(err);
    return NextResponse.json({ error: `API threw: ${msg}` }, { status });
  }
}
