export interface UserMessage {
  user_message_id: string; // uuid
  user_id: string;         // uuid
  chat_id: string;         // uuid
  content: string;
  created_at: Date;
  updated_at: Date;
}

