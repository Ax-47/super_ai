import { inject, injectable } from "tsyringe";
import { Usecase } from "../interface";
import type { ReadQAPairsRepository } from "../../repositories/qa_pair/read_qa_pairs";
import { QAPairsResponseType } from "../../dtos/qa_pair";
interface Input {
  limit: number;
  pagingState?: string;
  category_id?: string;
}

interface Output {
  qa_pairs: QAPairsResponseType[];
  nextPagingState?: string;
}

@injectable()
export class ReadQAPairsUsecase implements Usecase<Input, Output> {
  constructor(
    @inject("ReadQAPairsRepository") // เปลี่ยน token ให้ตรงกับ qa_pairs repository
    private read_qa_pairs_repo: ReadQAPairsRepository
  ) { }

  async execute({ limit, pagingState, category_id }: Input): Promise<Output> {
    try {
      const result = await this.read_qa_pairs_repo.read_all_paginated(limit, pagingState, category_id);

      return {
        qa_pairs: result.qa_pairs.map((q) => ({
          qa_pair_id: q.qa_pair_id,
          question: q.question,
          answer: q.answer,
          category_id: q.category_id,
          category_name: q.category_name,
          created_at: q.created_at,
          updated_at: q.updated_at,
        })),
        nextPagingState: result.nextPagingState,
      };
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: { limit, pagingState },
        error: err,
      });
      throw new Error("UsecaseError: Failed to read qa_pairs.");
    }
  }
}
