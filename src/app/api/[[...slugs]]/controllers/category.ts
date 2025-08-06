import Elysia, { t } from "elysia";
import { CreateCategoryUsecasePrompt, CategoryUsecaseResponse } from "../dtos/category";
import { CreateCategoryRepositoryImpl } from "../repositories/create_category";
import { DatabaseRepository } from "../infrastructures/database";
import { ReadCategoryRepositoryImpl } from "../repositories/read_category";
import { createCategoryUsecase } from "../usecases/create_category";
import { readCategoryIdUsecase } from "../usecases/read_category_id";
const database = new DatabaseRepository([process.env.DATABASE_URL!], process.env.DATABASE_KEYSPACE!) // FIX: in the future, it must be yml
const create_category_repo = new CreateCategoryRepositoryImpl(database);
const create_category_usecase = new createCategoryUsecase(create_category_repo);
const read_category_id_repo = new ReadCategoryRepositoryImpl(database);
const read_category_id_usecase = new readCategoryIdUsecase(read_category_id_repo);
export const CategoryController = new Elysia().group('/category',
  (app) =>
    app.get(
      '/:id',
      async ({ params: { id }, status }) => {
        try {
          const result = await read_category_id_usecase.execute(id);
          if (!result)
            return status(404, 'Not found');

          return result;
        } catch (err) {
          console.error("❌ Error in controller:", err);
          return status(400, 'Internal Server Error: Unable to create category');
        }
      },
      {
        params: t.Object({ id: t.String() }),
        response: {
          200: CategoryUsecaseResponse,
          400: t.String(),
          404: t.String(),
        },
      }
    )
      .post('/', async ({ body, status }) => {
        try {
          const res = await create_category_usecase.execute(body)
          return res

        } catch {
          return status(400, 'Internal Server Error: Unable to create category');
        }
      }, {
        body: CreateCategoryUsecasePrompt,
        response: {
          200: CategoryUsecaseResponse,
          400: t.String()
        }
      }
      )
)
