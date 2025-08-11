import Elysia from "elysia";
import { ErrorDTO } from "../dtos/error_dto";
import { container } from "@/app/api/[[...slugs]]/container";
import { CreateQAPairBodyDTO, QAPairResponseDTO } from "../dtos/qa_pair";
import { CreateQAPairUsecase } from "../usecases/qa_pair/create_category";
const create_qa_pair_usecase = container.resolve(CreateQAPairUsecase);
export const QAPairController = new Elysia().group("", (app) =>
  app
    .post(
      "/",
      async ({ body, status }) => {
        try {
          const res = await create_qa_pair_usecase.execute(body);
          return res;
        } catch (err) {
          console.error("❌ Error in create category:", err);
          return status(500, { error: "Internal Server Error: Unable to create category." });
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


)
