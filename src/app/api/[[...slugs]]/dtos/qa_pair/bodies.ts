import { Static, t } from "elysia";
import { NonEmptyString, UUIDString } from "../schema";

export const CreateQAPairBodyDTO = t.Object({
  question: NonEmptyString,
  answer: NonEmptyString,
  category_id: UUIDString,
});

export type CreateQAPairBodyType = Static<typeof CreateQAPairBodyDTO>;
