import { ChatUsecasePromptType } from "../dtos/chat";
import { ChatRepository } from "../repositories/chat";
import { Usecase } from "./interface";

export class chatUsecase implements Usecase<ChatUsecasePromptType, AsyncGenerator<string, void, unknown>> {
  chat_repo: ChatRepository;

  constructor(chat_repo: ChatRepository) {
    this.chat_repo = chat_repo;
  }

  execute({ prompt }: ChatUsecasePromptType): Promise<AsyncGenerator<string, void, unknown>> {
    const stream = this.chat_repo.chat(prompt);
    return Promise.resolve(stream);
  }
}
