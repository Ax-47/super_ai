import { inject, injectable } from "tsyringe";
import { Usecase } from "../interface";
import { CreateQAPairBodyType, QAPairResponseType } from "../../dtos/qa_pair";
import type { CreateQAPairRepository } from "../../repositories/qa_pair/qa_pair_create";

@injectable()
export class CreateQAPairUsecase implements Usecase<CreateQAPairBodyType, QAPairResponseType> {
  constructor(
    @inject("CreateQAPairRepository")
    private readonly repo: CreateQAPairRepository
  ) { }

  async execute({ answer, category_id, question }: CreateQAPairBodyType): Promise<QAPairResponseType> {
    const category = await this.repo.find_category(category_id);
    if (!category) {
      console.error(`🚨 Category not found: ${category_id}`);
      throw new Error("Category not found");
    }

    try {
      const qa_pair = await this.repo.insert_to_database({
        answer,
        question,
        category_id,
        category_name: category.category_name,
      });

      await this.repo.insert_to_vector_database(qa_pair);
      return qa_pair;

    } catch (err) {
      console.error("🚨 Failed to create QA pair:", { category_id, error: err });
      throw new Error("UsecaseError: Failed to create QA pair");
    }
  }
}
