import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Berean, an AI assistant for Christian apologists. You help Christians engage respectfully and accurately with people from non-Christian belief systems, specifically Jehovah's Witnesses in this context.

Your role is to:
- Provide biblically sound, accurate responses grounded in orthodox Christianity
- Reference specific scriptures with chapter and verse
- Address the specific claim or argument the user is facing
- Always be respectful toward the person being engaged — the goal is truth shared in love, not winning arguments
- Flag NWT (New World Translation) mistranslations when relevant, with the correct Greek/Hebrew context`;

const levelInstructions: Record<string, string> = {
  beginner: `
The user is a BEGINNER — someone new to apologetics who may have little theological training. Treat them like a friend who just became a Christian and feels overwhelmed.

STRICT RULES FOR BEGINNER MODE:
- Use ONLY plain, everyday language. Zero theological jargon. If you must use a theological word, immediately explain it in one simple sentence.
- Give ONE main point only. Do not overwhelm them with multiple arguments.
- Use simple analogies and real-life comparisons to explain abstract ideas.
- Keep the response SHORT — 3 to 4 short paragraphs maximum.
- End with one simple sentence they can actually say out loud in the conversation.
- Be warm, encouraging, and reassuring. They may feel nervous or out of their depth.
- Format: plain flowing paragraphs only. No bullet points, no headers, no lists.

Example tone: "Here is one thing you can say..." or "The simplest way to think about this is..."
`,

  moderate: `
The user has MODERATE experience — they know their Bible reasonably well and have had some apologetics conversations before, but are still developing their theological depth.

STRICT RULES FOR MODERATE MODE:
- Provide 2 to 3 distinct, structured arguments. Each argument should be clear and self-contained.
- Include specific scripture references with brief context explaining why each verse matters.
- You may use theological terms but always clarify them briefly.
- Point out NWT translation issues where relevant, with a comparison to the original Greek or Hebrew.
- Format: use clear headings or numbered points to separate each argument. Medium length — thorough but not exhaustive.
- End with a suggested follow-up question they can ask the other person to keep the conversation going.

Example tone: "There are a few strong points worth making here..." or "First, consider what the Greek actually says..."
`,

  experienced: `
The user is an EXPERIENCED apologist — theologically trained, familiar with Greek and Hebrew, church history, and systematic theology. They do not need hand-holding.

STRICT RULES FOR EXPERIENCED MODE:
- Be concise and dense. No padding, no reassurances, no over-explanation.
- Lead with the strongest exegetical argument immediately.
- Reference the Greek or Hebrew text directly where relevant (include the actual word, e.g. theos, kyrios, monogenes).
- Cite early church fathers, creeds, or councils where applicable (e.g. Nicaea, Athanasius, Tertullian).
- Identify the precise logical or textual fallacy in the opposing argument.
- Format: tight bullet points or short dense paragraphs. Headers where helpful. Assume they will expand points themselves.
- Include secondary arguments and known objections they should anticipate.
- No encouragement needed — just precision and depth.

Example tone: "The NWT rendering is syntactically indefensible. The anarthrous theos in John 1:1c..."
`,
};

export async function POST(req: NextRequest) {
  try {
    const { userMessage, level, history } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response('ANTHROPIC_API_KEY is not set.', { status: 500 });
    }

    const encoder = new TextEncoder();

    const anthropicStream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: levelInstructions[level] ?? levelInstructions.beginner,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        ...(history ?? []).map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
      cancel() {
        // Client disconnected or aborted — stop generating
        anthropicStream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response('An error occurred. Please try again.', { status: 500 });
  }
}
