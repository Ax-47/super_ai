import Elysia, { t } from "elysia";
import { CreateCategoryUsecasePrompt, CategoryUsecaseResponse, UpdateCategoryUsecaseResponse } from "../dtos/category";
import { CreateCategoryRepositoryImpl } from "../repositories/create_category";
import { DatabaseRepository } from "../infrastructures/database";
import { ReadCategoryIdRepositoryImpl } from "../repositories/read_category";
import { createCategoryUsecase } from "../usecases/create_category";
import { readCategoryIdUsecase } from "../usecases/read_category_id";
import { ReadCategoriesRepositoryImpl } from "../repositories/read_categories";
import { ReadCategoriesUsecase } from "../usecases/read_categories";
import { UpdateCategoryRepositoryImpl } from "../repositories/update_category";
import { updateCategoryUsecase } from "../usecases/update_category";
const database = new DatabaseRepository([process.env.DATABASE_URL!], process.env.DATABASE_KEYSPACE!) // FIX: in the future, it must be yml
const create_category_repo = new CreateCategoryRepositoryImpl(database);
const create_category_usecase = new createCategoryUsecase(create_category_repo);
const read_category_id_repo = new ReadCategoryIdRepositoryImpl(database);
const read_category_id_usecase = new readCategoryIdUsecase(read_category_id_repo);

const read_categories_repo = new ReadCategoriesRepositoryImpl(database);
const read_categories_usecase = new ReadCategoriesUsecase(read_categories_repo);

const update_category_repo = new UpdateCategoryRepositoryImpl(database);
const update_category_usecase = new updateCategoryUsecase(update_category_repo);
export const CategoryController = new Elysia().group('/category',
  (app) =>
    app
      .get(
        '/',
        async ({ query: { limit, paging_state }, status }) => {
          try {
            const normalizedPagingState =
              typeof paging_state === 'string' && paging_state !== '' ? paging_state : undefined;

            const res = await read_categories_usecase.execute({
              limit,
              pagingState: normalizedPagingState,
            });
            return res;
          } catch (err) {
            console.error("❌ Error in read categories controller:", err);
            return status(400, "Failed to read categories");
          }
        },
        {
          query: t.Object({
            limit: t.Numeric({ default: 50, minimum: 1, maximum: 500 }),
            paging_state: t.Optional(t.String()),
          }),
          response: {
            200: t.Object({
              categories: t.Array(CategoryUsecaseResponse),
              nextPagingState: t.Optional(t.String()),
            }),
            400: t.String(),
          },
        }
      )
      .get(
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
      .put("/:id", async ({ params: { id }, body, status }) => {
        try {
          const res = await update_category_usecase.execute({
            category_id: id,
            category_name: body.category_name,
          })
          return res
        } catch {
          return status(400, 'Internal Server Error: Unable to create category');
        }
      }, {
        params: t.Object({ id: t.String() }),
        body: t.Object({ category_name: t.String() }),
        response: {
          200: UpdateCategoryUsecaseResponse,
          400: t.String(),
        },
      })
  // .delete("/:id", async ({ params: { id }, status }) => {
  //     try {
  //       const res = await create_category_usecase.execute(id)
  //       return res
  //
  //     } catch {
  //       return status(400, 'Internal Server Error: Unable to create category');
  //     }
  //   }, {
  //     params: t.Object({ id: t.String() }),
  //     response: {
  //       200: CategoryUsecaseResponse,
  //       400: t.String(),
  //       404: t.String(),
  //     },
  //   })
)
