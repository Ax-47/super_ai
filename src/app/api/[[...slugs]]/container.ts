import "reflect-metadata";
import { container } from "tsyringe";
import { Client } from "cassandra-driver";
import { DatabaseRepository } from "./infrastructures/database";
import { UpdateCategoryRepository, UpdateCategoryRepositoryImpl } from "./repositories/category/update_category";
import { ReadCategoriesRepository, ReadCategoriesRepositoryImpl } from "./repositories/category/read_categories";
import { ReadCategoryIdRepository, ReadCategoryIdRepositoryImpl } from "./repositories/category/read_category";
import { CreateCategoryRepository, CreateCategoryRepositoryImpl } from "./repositories/category/create_category";
import { DeleteCategoryRepository, DeleteCategoryRepositoryImpl } from "./repositories/category/delete_category";
container.register(Client, {
  useValue: new Client({
    contactPoints: [process.env.DATABASE_URL!],
    localDataCenter: "datacenter1",
    keyspace: process.env.DATABASE_KEYSPACE!
  })
});
container.register("DatabaseRepository", { useClass: DatabaseRepository });
container.register<ReadCategoriesRepository>("ReadCategoriesRepository", {
  useClass: ReadCategoriesRepositoryImpl
});

container.register<ReadCategoryIdRepository>("ReadCategoryIdRepository", {
  useClass: ReadCategoryIdRepositoryImpl
});

container.register<CreateCategoryRepository>("CreateCategoryRepository", {
  useClass: CreateCategoryRepositoryImpl
});

container.register<UpdateCategoryRepository>("UpdateCategoryRepository", {
  useClass: UpdateCategoryRepositoryImpl
});

container.register<DeleteCategoryRepository>("DeleteCategoryRepository", {
  useClass: DeleteCategoryRepositoryImpl
});
export { container };
