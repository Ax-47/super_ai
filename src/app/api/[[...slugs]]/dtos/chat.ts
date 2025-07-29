import { Static, t } from 'elysia';

export const ChatUsecasePrompt = t.Object(
  {
    prompt: t.String()
  }
)
export const ChatUsecaseResponse = t.Object(
  {
    response: t.String()
  }
)
export type ChatUsecaseResponseType = Static<typeof ChatUsecaseResponse>;

export type ChatUsecasePromptType = Static<typeof ChatUsecasePrompt>;
