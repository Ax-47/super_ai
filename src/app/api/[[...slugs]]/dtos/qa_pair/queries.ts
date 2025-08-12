import { t } from "elysia";

export const ReadQAPairsQueryDTO = t.Object({
  limit: t.Integer({
    default: 50,
    minimum: 1,
    maximum: 500,
    error: '{"error": "limit must be integer between 1 and 500"}',
  }),
  paging_state: t.Optional(t.String()),
  category_id: t.Optional(t.String({
    format: "uuid",
    description: "UUID format string",
    error: '{"error": "Invalid UUID"}',
  })),
});
