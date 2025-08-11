import { injectable, inject } from "tsyringe";
import { UpdateCategory } from "../../domain";
import type { UpdateCategoryRepository } from "../../repositories/category/update_category";
import { Usecase } from "../interface";
interface Input {
  category_id: string;
  category_name: string;
}

@injectable()
export class UpdateCategoryUsecase implements Usecase<Input, UpdateCategory> {
  constructor(
    @inject("UpdateCategoryRepository") private update_category_repo: UpdateCategoryRepository
  ) { }

  async execute(cat: Input): Promise<UpdateCategory> {
    try {
      const res = await this.update_category_repo.update(cat.category_id, cat.category_name);
      return {
        category_id: res.category_id,
        category_name: res.category_name,
        updated_at: res.updated_at,
      };
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: cat,
        error: err,
      });
      throw new Error("UsecaseError: Failed to update category.");
    }
  }
}
