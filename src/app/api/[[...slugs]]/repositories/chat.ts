import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
export interface ChatRepository {
  chat(prompt: string): Promise<GenerateContentResponse>
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
  async chat(prompt: string): Promise<GenerateContentResponse> {
    return this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
    });
  }
}
