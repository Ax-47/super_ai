
export interface QAPair {
  qa_pair_id: string;      // uuid
  question: string;        // uuid (should point to message or data)
  answer: string;          // uuid (should point to message or data)
  category_id: string;     // uuid
  category_name: string;
  created_at: Date;
  updated_at: Date;
}
export type QAPairInsert = Omit<QAPair, "qa_pair_id" | "created_at" | "updated_at">;
