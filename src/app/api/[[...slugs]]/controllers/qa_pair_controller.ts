import Elysia from "elysia";
import { ErrorDTO } from "../dtos/error_dto";
import { container } from "@/app/api/[[...slugs]]/container";
import { CreateQAPairBodyDTO, QAPairResponseDTO, ReadQAPairsQueryDTO, ReadQAPairsResponseDTO } from "../dtos/qa_pair";
import { CreateQAPairUsecase } from "../usecases/qa_pair/create_category";
import { ReadQAPairsUsecase } from "../usecases/qa_pair/read_categories";
const create_qa_pair_usecase = container.resolve(CreateQAPairUsecase);
const read_qa_pairs_usecase = container.resolve(ReadQAPairsUsecase);
export const QAPairController = new Elysia().group("", (app) =>
  app
    .post(
      "/",
      async ({ body, status }) => {
        try {
          const res = await create_qa_pair_usecase.execute(body);
          return res;
        } catch (err) {
          console.error("❌ Error in create QA Pair:", err);
          return status(500, { error: "Internal Server Error: Unable to create QA Pair." });
        }
      },
      {
        body: CreateQAPairBodyDTO,
        response: {
          200: QAPairResponseDTO,
          500: ErrorDTO
        },
        detail: {
          summary: "Create new QA-Pair",
          tags: ["QA-Pair"],
        },
      }
    )
    .get(
      "/",
      async ({ query, set }) => {
        try {
          const limit = Number(query.limit ?? 50);
          const pagingState = query.paging_state ?? undefined;
          const category_id = query.category_id ?? undefined;
          const result = await read_qa_pairs_usecase.execute({ limit, pagingState, category_id });
          return result;
        } catch (err) {
          console.error("🚨 Route Error:", err);
          set.status = 500;
          return { error: "Failed to fetch qa_pairs" };
        }
      },
      {
        query: ReadQAPairsQueryDTO,
        response: {
          200: ReadQAPairsResponseDTO,
          500: ErrorDTO,
        }, detail: {
          summary: "Get QA Pairs (with pagination & filter)",
          tags: ["QA-Pair"]
        }
      }
    ))
