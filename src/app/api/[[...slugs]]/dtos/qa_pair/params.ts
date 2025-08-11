import { t } from "elysia";
import { UUIDString } from "../schema";

export const CategoryIdParamDTO = t.Object({
  category_id: UUIDString,
});
