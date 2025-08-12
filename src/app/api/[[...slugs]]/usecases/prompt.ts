import { inject, injectable } from "tsyringe";
import { PromptUsecasePromptType } from "../dtos/prompt";
import type { ChatRepository } from "../repositories/chat";

@injectable()
export class ChatUsecase {
  constructor(
    @inject("ChatRepository") private chat_repo: ChatRepository

  ) { }
  async *execute({ prompt }: PromptUsecasePromptType): AsyncGenerator<string, void, unknown> {
    const categoryListStr = await this.chat_repo.getCategoryListString();
    const classifierPrompt = this.chat_repo.buildClassifierPrompt(prompt, categoryListStr);
    let res = "";
    for await (const chunk of this.chat_repo.prompt(classifierPrompt))
      res += chunk;
    const predictedCategory = res.trim().replace("-", "").trim();
    try {
      const { metadatas } = await this.chat_repo.search(predictedCategory, prompt);
      if (!metadatas || !metadatas[0] || !metadatas[0].answer) {
        yield "ขออภัย ฉันไม่สามารถหาข้อมูลที่ตรงกับคำถามของคุณได้ในขณะนี้";
        return;
      }
      const retrievedAnswer = (metadatas[0]).answer;
      const generatorPrompt = this.chat_repo.buildGeneratorPrompt(prompt, retrievedAnswer.toString());
      for await (const chunk of this.chat_repo.prompt(generatorPrompt))
        yield chunk;
    } catch {
      yield "ขออภัย ฉันไม่สามารถหาข้อมูลที่ตรงกับคำถามของคุณได้ในขณะนี้";
      return;
    }
  }
}
