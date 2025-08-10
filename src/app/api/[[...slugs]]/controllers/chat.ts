import Elysia from "elysia";
import { PromptUsecasePrompt } from "../dtos/prompt";
import { PromptRepositoryImpl } from "../repositories/chat";
import { chatUsecase } from "../usecases/prompt";
import { sse } from "./sse"
import { VectorDatabaseRepository } from "../infrastructures/vector_db";
import { DatabaseRepository } from "../infrastructures/database";

// const database = new DatabaseRepository([process.env.DATABASE_URL!], process.env.DATABASE_KEYSPACE!) // FIX: in the future, it must be yml
// const vector_db = new VectorDatabaseRepository(process.env.VECTOR_DATABASE_URL!)
// const repo = new PromptRepositoryImpl(process.env.LLMAPIKEY!, process.env.LLMMODEL!, vector_db, database)
// const usecase = new chatUsecase(repo)
// type PromptSSEContext = {
//   set: { headers: Record<string, string> };
//   body: {
//     prompt: string,
//   };
// };
// export const PromptController = new Elysia().group("/chat", (app) =>
//   app.post(
//     "/",
//     sse<PromptSSEContext, string>(
//       async function* ({ body }) {
//         const stream = await usecase.execute(body);
//         for await (const chunk of stream) {
//           yield chunk;
//         }
//       }
//     ),
//     {
//       body: PromptUsecasePrompt,
//     }
//   )
// );
