import "reflect-metadata";
import { container } from "tsyringe";
import { Client } from "cassandra-driver";
import { DatabaseRepository } from "./infrastructures/database";
import { UpdateCategoryRepository, UpdateCategoryRepositoryImpl } from "./repositories/category/update_category";
import { ReadCategoriesRepository, ReadCategoriesRepositoryImpl } from "./repositories/category/read_categories";
import { ReadCategoryIdRepository, ReadCategoryIdRepositoryImpl } from "./repositories/category/read_category";
import { CreateCategoryRepository, CreateCategoryRepositoryImpl } from "./repositories/category/create_category";
import { DeleteCategoryRepository, DeleteCategoryRepositoryImpl } from "./repositories/category/delete_category";
import { VectorDatabaseRepository } from "./infrastructures/vector_db";
import { CategoryDatabaseRepository, CategoryDatabaseRepositoryImpl } from "./infrastructures/category/database";
import { ChromaClient } from "chromadb";
import { CreateQAPairRepository, CreateQAPairRepositoryImpl } from "./repositories/qa_pair/qa_pair_create";
import { QAPairDatabaseRepository, QAPairDatabaseRepositoryImpl } from "./infrastructures/qa_pair/database";
import { QAPairVectorDatabaseRepository, QAPairVectorDatabaseRepositoryImpl } from "./infrastructures/qa_pair/vector_database";
container.register(Client, {
  useValue: new Client({
    contactPoints: [process.env.DATABASE_URL!],
    localDataCenter: "datacenter1",
    keyspace: process.env.DATABASE_KEYSPACE!
  })
});

container.register(ChromaClient, {
  useValue: new ChromaClient(
    {
      ssl: false,
      host: "localhost",
      port: 8000,
      tenant: "default_tenant",
      database: "default_database",
    }
  )
});
container.register("DatabaseRepository", { useClass: DatabaseRepository });
container.register<CategoryDatabaseRepository>("CategoryDatabaseRepository", { useClass: CategoryDatabaseRepositoryImpl });
container.register<QAPairDatabaseRepository>("QAPairDatabaseRepository", { useClass: QAPairDatabaseRepositoryImpl });
container.register("VectorDatabaseRepository", { useClass: VectorDatabaseRepository });
container.register<QAPairVectorDatabaseRepository>("QAPairVectorDatabaseRepository", { useClass: QAPairVectorDatabaseRepositoryImpl });

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

container.register<CreateQAPairRepository>("CreateQAPairRepository", {
  useClass: CreateQAPairRepositoryImpl
});
export { container };
