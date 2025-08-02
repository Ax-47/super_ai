import Elysia from "elysia";
import { ChatUsecasePrompt } from "../dtos/chat";
import { ChatRepositoryImpl } from "../repositories/chat";
import { chatUsecase } from "../usecases/chat";
import { sse } from "./sse"
const repo = new ChatRepositoryImpl(process.env.LLMAPIKEY!, process.env.LLMMODEL!)
const usecase = new chatUsecase(repo)
type ChatSSEContext = {
  set: { headers: Record<string, string> };
  body: {
    prompt: string,
  };
};
export const ChatController = new Elysia().group("/chat", (app) =>
  app.post(
    "/",
    sse<ChatSSEContext, string>(
      async function* ({ body }) {
        console.log(body.prompt)
        const stream = await usecase.execute(body);
        for await (const chunk of stream) {
          console.log(chunk)
          yield chunk;
        }
      }
    ),
    {
      body: ChatUsecasePrompt,
    }
  )
);
