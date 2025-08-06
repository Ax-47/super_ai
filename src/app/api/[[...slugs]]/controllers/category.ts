import Elysia, { t } from "elysia";
import { CreateCategoryUsecasePrompt, CreateCategoryUsecaseResponse } from "../dtos/category";
import { CreateCategoryRepositoryImpl } from "../repositories/create_category";
import { DatabaseRepository } from "../infrastructures/database";
const database = new DatabaseRepository([process.env.DATABASE_URL!], process.env.DATABASE_KEYSPACE!) // FIX: in the future, it must be yml
const create_category_usecase = new CreateCategoryRepositoryImpl(database);
export const CategoryController = new Elysia().group('/category',
  (app) =>
    app
      .get('/', () => "hello")
      .post('/', async ({ body, status }) => {
        try {
          const res = await create_category_usecase.create(body)
          return res

        } catch {
          return status(400, 'Internal Server Error: Unable to create category');
        }
      }, {
        body: CreateCategoryUsecasePrompt,
        response: {
          200: CreateCategoryUsecaseResponse,
          400: t.String()
        }
      }
      )
)
