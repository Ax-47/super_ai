import Elysia from "elysia";
import { ErrorDTO } from "../dtos/error_dto";
import { MessageDTO } from "../dtos/message";
import { CategoryIdParamDTO, CategoryResponseDTO, CreateCategoryBodyDTO, ReadCategoriesQueryDTO, ReadCategoriesResponseDTO, UpdateCategoryBodyDTO, UpdateCategoryResponseDTO } from "../dtos/category";
import { UpdateCategoryUsecase } from "../usecases/category/update_category";
import { ReadCategoryIdUsecase } from "../usecases/category/read_category_id";
import { ReadCategoriesUsecase } from "../usecases/category/read_categories";
import { CreateCategoryUsecase } from "../usecases/category/create_category";
import { DeleteCategoryUsecase } from "../usecases/category/delete_category";
import { container } from "@/app/api/[[...slugs]]/container";
const read_categories_usecase = container.resolve(ReadCategoriesUsecase);
const read_category_id_usecase = container.resolve(ReadCategoryIdUsecase);
const create_category_usecase = container.resolve(CreateCategoryUsecase);
const update_category_usecase = container.resolve(UpdateCategoryUsecase);
const delete_category_usecase = container.resolve(DeleteCategoryUsecase);
export const CategoryController = new Elysia().group("", (app) =>
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
          return status(500, { error: "Failed to read categories" });
        }
      },
      {
        query: ReadCategoriesQueryDTO,
        response: {
          200: ReadCategoriesResponseDTO,
          500: ErrorDTO,
        },
        detail: {
          summary: "Get list of categories",
          tags: ["Category"],
        },
      }
    )
    .get(
      "/:id",
      async ({ params: { category_id }, status }) => {
        try {
          const result = await read_category_id_usecase.execute(category_id);
          return result ?? status(404, { error: "Category not found" });
        } catch (err) {
          console.error("❌ Error in get category by ID:", err);
          return status(500, { error: "Internal Server Error: Unable to retrieve category." });
        }
      },
      {
        params: CategoryIdParamDTO,
        response: {
          200: CategoryResponseDTO,
          404: ErrorDTO,
          500: ErrorDTO
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
          return status(500, { error: "Internal Server Error: Unable to create category." });
        }
      },
      {
        body: CreateCategoryBodyDTO,
        response: {
          200: CategoryResponseDTO,
          500: ErrorDTO
        },
        detail: {
          summary: "Create new category",
          tags: ["Category"],
        },
      }
    )
    .put(
      "/:id",
      async ({ params: { category_id }, body, status }) => {
        try {
          const res = await update_category_usecase.execute({
            category_id: category_id,
            category_name: body.category_name,
          });
          return res;
        } catch (err) {
          console.error("❌ Error in update category:", err);
          return status(500, { error: "Internal Server Error: Unable to update category." });
        }
      },
      {
        params: CategoryIdParamDTO,
        body: UpdateCategoryBodyDTO,
        response: {
          200: UpdateCategoryResponseDTO,
          500: ErrorDTO,
        },
        detail: {
          summary: "Update category by ID",
          tags: ["Category"],
        },
      }
    )
    .delete(
      "/:id",
      async ({ params: { category_id }, status }) => {
        try {
          await delete_category_usecase.execute(category_id);
          return { message: "Category deleted successfully." };
        } catch (err) {
          console.error("❌ Failed to delete category:", { category_id, error: err });
          return status(500, { error: "Internal Server Error: Unable to delete category." });
        }
      },
      {
        params: CategoryIdParamDTO,
        response: {
          200: MessageDTO,
          500: ErrorDTO,
        },
        detail: {
          summary: "Delete category by ID",
          tags: ["Category"],
        },
      }
    )
);
