import { t } from 'elysia';

export const UUIDString = t.String({
  format: "uuid",
  description: "UUID format string",
  error: '{"error": "Invalid UUID"}',
});

export const NonEmptyString = t.String({
  minLength: 1,
  error: '{"error": "Value must be a non-empty string"}',
});

export const Timestamp = t.Date();


