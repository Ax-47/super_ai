import Elysia from "elysia";
import { ChatUsecasePrompt, ChatUsecaseResponse } from "../dtos/chat";
import { ChatRepositoryImpl } from "../repositories/chat";
import { chatUsecase } from "../usecases/chat";
const repo = new ChatRepositoryImpl(process.env.LLMAPIKEY!, process.env.LLMMODEL!)
const usecase = new chatUsecase(repo)

export const ChatController = new Elysia().group('/chat',
  (app) =>
    app
      .post("/", async ({ body }) => {
        return await usecase.execute(body)
      }, { body: ChatUsecasePrompt, response: ChatUsecaseResponse })
)
