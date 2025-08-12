import { inject, injectable } from 'tsyringe';
import type { LLMRepository } from '../infrastructures/llm';
import { Metadata } from '../infrastructures/vector_db';
import type { QAPairVectorDatabaseRepository } from '../infrastructures/qa_pair/vector_database';

export interface ChatRepository {
  getCategoryListString(): Promise<string>;
  buildClassifierPrompt(userQuestion: string, categoryListStr: string): string;
  buildGeneratorPrompt(userQuestion: string, retrievedAnswer: string): string;
  prompt(prompt: string): AsyncGenerator<string, void, unknown>;
  search(
    category: string,
    prompt: string,
    n?: number
  ): Promise<{
    documents: string[];
    metadatas: Metadata[];
    ids: string[];
    distances: number[];
  }>;
}
@injectable()
export class ChatRepositoryImpl implements ChatRepository {
  constructor(
    @inject("LLMRepository") private readonly llm_repo: LLMRepository,
    @inject("QAPairVectorDatabaseRepository")
    private readonly vector_database_repo: QAPairVectorDatabaseRepository,
  ) { }

  async getCategoryListString(): Promise<string> {
    // mock data ตอนนี้
    const categories = ["academic_calendar", "admissions", "curriculum_and_tuition_fees"];
    // TODO: ภายหลังเปลี่ยนเป็น:
    // const categories = await this.redisClient.get("categories");
    return categories.map(cat => `- ${cat}`).join("\n");
  }
  buildClassifierPrompt(userQuestion: string, categoryListStr: string): string {
    return `
      จากคำถามของผู้ใช้ โปรดวิเคราะห์และเลือกหมวดหมู่ที่เกี่ยวข้องที่สุดเพียง 1 หมวดหมู่จากรายการต่อไปนี้

      รายการหมวดหมู่:
      ${categoryListStr}

      คำถามของผู้ใช้: "${userQuestion}"

      โปรดตอบเฉพาะชื่อหมวดหมู่ที่เลือกเท่านั้น ห้ามมีคำอธิบายอื่น
    `;
  }
  buildGeneratorPrompt(userQuestion: string, retrievedAnswer: string): string {
    return `
      คุณคือ Chatbot ผู้ช่วยของมหาวิทยาลัย
      โปรดตอบคำถามของผู้ใช้โดยอ้างอิงจาก "ข้อมูลสำหรับตอบคำถาม" ที่ให้มาเท่านั้นเท่านั้น
      และอย่าพยายามสร้างข้อมูลขึ้นมาเอง

      ข้อมูลสำหรับตอบคำถาม: "${retrievedAnswer}"
      คำถามของผู้ใช้: "${userQuestion}"

      คำตอบ (เรียบเรียงให้เป็นธรรมชาติ):
  `;
  }
  async search(
    category: string,
    prompt: string,
    n?: number
  ): Promise<{
    documents: string[];
    metadatas: Metadata[];
    ids: string[];
    distances: number[];
  }> {
    return await this.vector_database_repo.search(category, prompt, n);
  }
  async *prompt(prompt: string): AsyncGenerator<string, void, unknown> {
    const stream = this.llm_repo.prompt(prompt);
    for await (const chunk of stream) {
      yield chunk;
    }
  }
}
