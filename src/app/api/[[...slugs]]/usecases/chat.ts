import { ChatUsecasePromptType, ChatUsecaseResponseType } from "../dtos/chat";
import { ChatRepository } from "../repositories/chat";
import { Usecase } from "./interface";

export class chatUsecase implements Usecase<ChatUsecasePromptType, ChatUsecaseResponseType> {
  chat_repo: ChatRepository
  constructor(chat_repo: ChatRepository) {
    this.chat_repo = chat_repo
  }
  async execute({ prompt }: ChatUsecasePromptType): Promise<{ response: string; }> {
    return { response: (await this.chat_repo.chat(prompt)).text || "" }
  }
}
