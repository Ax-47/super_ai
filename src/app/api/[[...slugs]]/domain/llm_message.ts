export interface LLMMessage {
  llm_message_id: string;  // uuid
  category_id: string;     // uuid
  user_id: string;         // uuid
  category_name: string;
  chat_id: string;         // uuid
  content: string;
  created_at: Date;
  updated_at: Date;
}

