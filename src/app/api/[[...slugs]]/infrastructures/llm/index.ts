import { GoogleGenAI } from '@google/genai';
import { inject, injectable } from 'tsyringe';
export interface LLMRepository {
  prompt(prompt: string): AsyncGenerator<string, void, unknown>
}
@injectable()
export class LLMRepositoryImpl implements LLMRepository {
  constructor(
    @inject(GoogleGenAI) private readonly llm: GoogleGenAI,
    @inject("MODEL_NAME") private readonly model: string
  ) { }
  async *prompt(prompt: string): AsyncGenerator<string, void, unknown> {
    const stream = await this.llm.models.generateContentStream({
      model: this.model,
      contents: prompt,
    });
    for await (const chunk of stream)
      if (chunk.text)
        yield chunk.text;
  }
}
