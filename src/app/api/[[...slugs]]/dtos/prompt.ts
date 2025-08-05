import { Static, t } from 'elysia';

export const PromptUsecasePrompt = t.Object(
  {
    prompt: t.String()
  }
)
export const PromptUsecaseResponse = t.Object(
  {
    response: t.String()
  }
)
export type PromptUsecaseResponseType = Static<typeof PromptUsecaseResponse>;

export type PromptUsecasePromptType = Static<typeof PromptUsecasePrompt>;
