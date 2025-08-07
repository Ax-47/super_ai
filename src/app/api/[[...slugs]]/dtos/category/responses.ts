import { Static, t } from "elysia";
import { NonEmptyString, Timestamp, UUIDString } from "../schema";

export const CategoryResponseDTO = t.Object({
  category_id: UUIDString,
  category_name: NonEmptyString,
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const UpdateCategoryResponseDTO = t.Object({
  category_id: UUIDString,
  category_name: NonEmptyString,
  updated_at: Timestamp,
});

export const ReadCategoriesResponseDTO = t.Object({
  categories: t.Array(CategoryResponseDTO),
  nextPagingState: t.Optional(t.String()),
});

export type CategoryResponseType = Static<typeof CategoryResponseDTO>;
export type UpdateCategoryResponseType = Static<typeof UpdateCategoryResponseDTO>;
export type ReadCategoriesResponseType = Static<typeof ReadCategoriesResponseDTO>;
