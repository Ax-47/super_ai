import Elysia, { sse } from "elysia";
import { PromptUsecasePrompt } from "../dtos/prompt";
import { ChatUsecase } from "../usecases/prompt";
import { container } from "@/app/api/[[...slugs]]/container";
const chat_usecase = container.resolve(ChatUsecase);
export const PromptController = new Elysia().group("", (app) =>
  app.post(
    "/", async function* ({ body }) {
      const stream = chat_usecase.execute(body);
      for await (const chunk of stream) {
        yield sse({
          event: "message",
          data: { message: chunk },
        });
      }
    },
    {
      body: PromptUsecasePrompt,
      description: "Receive prompt and return streaming response via SSE",
      tags: ["Chat"],
    }
  )
);

