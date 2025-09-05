import { Static, t } from "elysia";
import { NonEmptyString, Timestamp, UUIDString } from "../schema";

export const QAPairResponseDTO = t.Object({
  category_id: UUIDString,
  category_name: NonEmptyString,
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const QAPairsResponseDTO = t.Object({
  category_id: UUIDString,
  qa_pair_id: UUIDString,
  question: NonEmptyString,
  answer: NonEmptyString,
  category_name: NonEmptyString,
  created_at: Timestamp,
  updated_at: Timestamp,
});
export const UpdateCategoryResponseDTO = t.Object({
  category_id: UUIDString,
  category_name: NonEmptyString,
  updated_at: Timestamp,
});

export const ReadQAPairsResponseDTO = t.Object({
  qa_pairs: t.Array(QAPairsResponseDTO),
  nextPagingState: t.Optional(t.String()),
});

export type QAPairResponseType = Static<typeof QAPairResponseDTO>;
export type QAPairsResponseType = Static<typeof QAPairsResponseDTO>;
export type UpdateCategoryResponseType = Static<typeof UpdateCategoryResponseDTO>;
export type ReadQAPairsResponseType = Static<typeof ReadQAPairsResponseDTO>;
