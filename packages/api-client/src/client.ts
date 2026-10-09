import Anthropic from '@anthropic-ai/sdk';
import type { ChatOptions, ChatResponse } from './types';

const SYSTEM_PROMPT = `You are Berean, an AI assistant for Christian apologists. You help Christians engage respectfully and accurately with people from other belief systems. You provide biblically grounded talking points, scripture references, and contextual explanations tailored to the user's experience level.

Always be respectful toward the person being engaged — the goal is truth shared in love, not winning arguments.`;

export class BereanClient {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const { userLevel, opponentProfile, history, userMessage } = options;

    const levelInstruction =
      userLevel === 'beginner'
        ? 'Explain step by step in simple language. Avoid jargon.'
        : userLevel === 'moderate'
        ? 'Provide structured talking points with moderate theological depth.'
        : 'Provide concise, advanced theological arguments with full references.';

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: `User level: ${userLevel}. ${levelInstruction}\nOpponent profile: ${opponentProfile}.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        ...history.map((msg) => ({
          role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ],
    });

    const cached =
      (response.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens !== undefined &&
      ((response.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0) > 0;

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      cached,
    };
  }
}
