import { GoogleGenAI } from '@google/genai';
import { VectorDatabaseRepository } from '../infrastructures/vector_db';
import { DatabaseRepository } from '../infrastructures/database';
export interface ChatRepository {
  chat(prompt: string): AsyncGenerator<string, void, unknown>
}
export class ChatRepositoryImpl implements ChatRepository {
  private ai: GoogleGenAI
  private model: string
  private vector_database: VectorDatabaseRepository
  private database: DatabaseRepository;
  constructor(apiKey: string,
    model: string,
    vector_database: VectorDatabaseRepository,
    database: DatabaseRepository,
  ) {
    this.model = model;
    this.ai = new GoogleGenAI({ apiKey: apiKey });
    this.vector_database = vector_database
    this.database = database;
  }
  async *chat(prompt: string): AsyncGenerator<string, void, unknown> {

    const stream = await this.ai.models.generateContentStream({
      model: this.model,
      contents: prompt,
    });

    for await (const chunk of stream)
      if (chunk.text)
        yield chunk.text;
  }
}
