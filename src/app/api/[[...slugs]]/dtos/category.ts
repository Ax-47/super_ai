import { Static, t } from 'elysia';

export const CreateCategoryUsecasePrompt = t.Object(
  {
    category_name: t.String()
  }
)
export const CreateCategoryUsecaseResponse = t.Object(
  {
    category_id: t.String(),
    category_name: t.String()
  }
)
export type CreateCategoryUsecaseResponseType = Static<typeof CreateCategoryUsecasePrompt>;

export type CreateCategoryUsecasePromptType = Static<typeof CreateCategoryUsecaseResponse>;
