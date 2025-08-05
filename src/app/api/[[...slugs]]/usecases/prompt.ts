import { PromptUsecasePromptType } from "../dtos/prompt";
import { PromptRepository } from "../repositories/chat";
import { Usecase } from "./interface";

export class chatUsecase implements Usecase<PromptUsecasePromptType, AsyncGenerator<string, void, unknown>> {
  chat_repo: PromptRepository;

  constructor(chat_repo: PromptRepository) {
    this.chat_repo = chat_repo;
  }

  execute({ prompt }: PromptUsecasePromptType): Promise<AsyncGenerator<string, void, unknown>> {
    const stream = this.chat_repo.prompt(prompt);
    return Promise.resolve(stream);
  }
}
