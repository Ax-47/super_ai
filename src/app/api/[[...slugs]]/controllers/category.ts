import Elysia, { t } from "elysia";
import { CreateCategoryUsecasePrompt, CategoryUsecaseResponse, UpdateCategoryUsecaseResponse } from "../dtos/category";
import { CreateCategoryRepositoryImpl } from "../repositories/category/create_category";
import { DatabaseRepository } from "../infrastructures/database";
import { ReadCategoryIdRepositoryImpl } from "../repositories/category/read_category";
import { createCategoryUsecase } from "../usecases/category/create_category";
import { readCategoryIdUsecase } from "../usecases/category/read_category_id";
import { ReadCategoriesRepositoryImpl } from "../repositories/category/read_categories";
import { ReadCategoriesUsecase } from "../usecases/category/read_categories";
import { UpdateCategoryRepositoryImpl } from "../repositories/category/update_category";
import { updateCategoryUsecase } from "../usecases/category/update_category";
import { DeleteCategoryRepositoryImpl } from "../repositories/category/delete_category";
import { deleteCategoryUsecase } from "../usecases/category/delete_category";
const database = new DatabaseRepository([process.env.DATABASE_URL!], process.env.DATABASE_KEYSPACE!) // FIX: in the future, it must be yml
const create_category_repo = new CreateCategoryRepositoryImpl(database);
const create_category_usecase = new createCategoryUsecase(create_category_repo);
const read_category_id_repo = new ReadCategoryIdRepositoryImpl(database);
const read_category_id_usecase = new readCategoryIdUsecase(read_category_id_repo);

const read_categories_repo = new ReadCategoriesRepositoryImpl(database);
const read_categories_usecase = new ReadCategoriesUsecase(read_categories_repo);

const update_category_repo = new UpdateCategoryRepositoryImpl(database);
const update_category_usecase = new updateCategoryUsecase(update_category_repo);

const delete_category_repo = new DeleteCategoryRepositoryImpl(database);
const delete_category_usecase = new deleteCategoryUsecase(delete_category_repo);

export const CategoryController = new Elysia().group("/category", (app) =>
  app
    .get(
      "/",
      async ({ query: { limit, paging_state }, status }) => {
        try {
          const normalizedPagingState =
            typeof paging_state === "string" && paging_state !== "" ? paging_state : undefined;

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
        detail: {
          summary: "Get list of categories",
          tags: ["Category"],
        },
      }
    )
    .get(
      "/:id",
      async ({ params: { id }, status }) => {
        try {
          const result = await read_category_id_usecase.execute(id);
          return result ?? status(404, "Category not found");
        } catch (err) {
          console.error("❌ Error in get category by ID:", err);
          return status(500, "Internal Server Error: Unable to retrieve category.");
        }
      },
      {
        params: t.Object({ id: t.String() }),
        response: {
          200: CategoryUsecaseResponse,
          404: t.String(),
          500: t.String(),
        },
        detail: {
          summary: "Get category by ID",
          tags: ["Category"],
        },
      }
    )
    .post(
      "/",
      async ({ body, status }) => {
        try {
          const res = await create_category_usecase.execute(body);
          return res;
        } catch (err) {
          console.error("❌ Error in create category:", err);
          return status(500, "Internal Server Error: Unable to create category.");
        }
      },
      {
        body: CreateCategoryUsecasePrompt,
        response: {
          200: CategoryUsecaseResponse,
          500: t.String(),
        },
        detail: {
          summary: "Create new category",
          tags: ["Category"],
        },
      }
    )
    .put(
      "/:id",
      async ({ params: { id }, body, status }) => {
        try {
          const res = await update_category_usecase.execute({
            category_id: id,
            category_name: body.category_name,
          });
          return res;
        } catch (err) {
          console.error("❌ Error in update category:", err);
          return status(500, "Internal Server Error: Unable to update category.");
        }
      },
      {
        params: t.Object({ id: t.String() }),
        body: t.Object({ category_name: t.String() }),
        response: {
          200: UpdateCategoryUsecaseResponse,
          500: t.String(),
        },
        detail: {
          summary: "Update category by ID",
          tags: ["Category"],
        },
      }
    )
    .delete(
      "/:id",
      async ({ params: { id }, status }) => {
        try {
          await delete_category_usecase.execute(id);
          return "Category deleted successfully.";
        } catch (err) {
          console.error("❌ Failed to delete category:", { id, error: err });
          return status(500, "Internal Server Error: Unable to delete category.");
        }
      },
      {
        params: t.Object({
          id: t.String({ description: "UUID of the category to delete" }),
        }),
        response: {
          200: t.String(),
          500: t.String(),
        },
        detail: {
          summary: "Delete category by ID",
          tags: ["Category"],
        },
      }
    )
);
