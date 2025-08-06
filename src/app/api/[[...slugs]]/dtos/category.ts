import { Static, t } from 'elysia';

export const CreateCategoryUsecasePrompt = t.Object(
  {
    category_name: t.String()
  }
)

export const CategoryIdUsecasePrompt = t.Object(
  {
    category_id: t.String()
  }
)
export const CategoryUsecaseResponse = t.Object(
  {
    category_id: t.String(),
    category_name: t.String(),
    created_at: t.Date(), // หรือ t.String() ก็ได้ถ้าเก็บเป็น ISO string
    updated_at: t.Date(), // ถ้ามีใน entity ด้วย
  }
)
export type CreateCategoryUsecasePromptType = Static<typeof CreateCategoryUsecasePrompt>;
export type CategoryIdUsecasePrompt = Static<typeof CategoryIdUsecasePrompt>;
export type CategoryUsecaseResponseType = Static<typeof CategoryUsecaseResponse>;
