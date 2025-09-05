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
import { CreateQAPairRepository, CreateQAPairRepositoryImpl } from "./repositories/qa_pair/create_qa_pair";
import { QAPairDatabaseRepository, QAPairDatabaseRepositoryImpl } from "./infrastructures/qa_pair/database";
import { QAPairVectorDatabaseRepository, QAPairVectorDatabaseRepositoryImpl } from "./infrastructures/qa_pair/vector_database";
import { ReadQAPairsRepository, ReadQAPairsRepositoryImpl } from "./repositories/qa_pair/read_qa_pairs";

import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import { GoogleGenAI } from "@google/genai";
import { ChatRepository, ChatRepositoryImpl } from "./repositories/chat";
import { LLMRepository, LLMRepositoryImpl } from "./infrastructures/llm";
container.register(ChromaClient, {
  useValue: new ChromaClient(
    {
      ssl: false,
      host: process.env.VECTOR_DATABASE_URL,
      port: Number(process.env.VECTOR_DATABASE_PORT),
      tenant: "default_tenant",
      database: "default_database",
    }
  )
});

container.register(GoogleGeminiEmbeddingFunction, {
  useValue:  new GoogleGeminiEmbeddingFunction({ apiKey: process.env.LLMAPIKEY,
          modelName: "gemini-embedding-001",
  })});
container.register(Client, {
  useValue: new Client({
    contactPoints: [process.env.DATABASE_URL!],
    localDataCenter: "datacenter1",
    keyspace: process.env.DATABASE_KEYSPACE!
  })
});
container.register(GoogleGenAI, { useValue: new GoogleGenAI({ apiKey: process.env.LLMAPIKEY }) });
container.register("MODEL_NAME", { useValue: process.env.LLMMODEL });
container.register("DatabaseRepository", { useClass: DatabaseRepository });
container.register<CategoryDatabaseRepository>("CategoryDatabaseRepository", { useClass: CategoryDatabaseRepositoryImpl });
container.register<QAPairDatabaseRepository>("QAPairDatabaseRepository", { useClass: QAPairDatabaseRepositoryImpl });
container.register("VectorDatabaseRepository", { useClass: VectorDatabaseRepository });
container.register<QAPairVectorDatabaseRepository>("QAPairVectorDatabaseRepository", { useClass: QAPairVectorDatabaseRepositoryImpl });
container.register<LLMRepository>("LLMRepository", {
  useClass: LLMRepositoryImpl
});
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

container.register<ReadQAPairsRepository>("ReadQAPairsRepository", {
  useClass: ReadQAPairsRepositoryImpl
});
container.register<ChatRepository>("ChatRepository", {
  useClass: ChatRepositoryImpl
})

export { container };
