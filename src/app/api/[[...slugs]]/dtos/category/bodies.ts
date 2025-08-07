import { Static, t } from "elysia";
import { NonEmptyString } from "../schema";

export const CreateCategoryBodyDTO = t.Object({
  category_name: NonEmptyString,
});

export const UpdateCategoryBodyDTO = t.Object({
  category_name: NonEmptyString,
});
export type CreateCategoryBodyType = Static<typeof CreateCategoryBodyDTO>;
export type UpdateCategoryBodyType = Static<typeof UpdateCategoryBodyDTO>;
