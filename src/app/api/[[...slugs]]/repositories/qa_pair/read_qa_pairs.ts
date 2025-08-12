
import { QAPair } from '../../domain';
import { inject, injectable } from "tsyringe";
import type { Paginated, QAPairDatabaseRepository } from '../../infrastructures/qa_pair/database';
export interface ReadQAPairsRepository {
  read_all_paginated(limit: number, pagingState?: string, categoryId?: string): Promise<Paginated<QAPair>>
}
@injectable()
export class ReadQAPairsRepositoryImpl implements ReadQAPairsRepository {
  constructor(
    @inject("QAPairDatabaseRepository")
    private qa_pair_database_repo: QAPairDatabaseRepository,
  ) { }

  async read_all_paginated(limit: number, pagingState?: string, categoryId?: string): Promise<Paginated<QAPair>> {
    return this.qa_pair_database_repo.read_all_paginated(limit, pagingState, categoryId)
  }
}
