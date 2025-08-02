import { GoogleGenAI } from '@google/genai';
export interface ChatRepository {
  chat(prompt: string): AsyncGenerator<string, void, unknown>
}
export class ChatRepositoryImpl implements ChatRepository {
  ai: GoogleGenAI
  model: string
  constructor(apiKey: string,
    model: string
  ) {
    this.model = model;
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }
  async *chat(prompt: string): AsyncGenerator<string, void, unknown> {
    const stream = await this.ai.models.generateContentStream({
      model: this.model,
      contents: prompt,
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
