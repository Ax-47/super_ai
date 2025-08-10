import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import 'reflect-metadata';
import { HelloWorldController } from './controllers/hello_world';
// import { PromptController } from './controllers/chat';
import { CategoryController } from './controllers/category';

const app = new Elysia({ prefix: '/api' })
  .use(
    swagger({
      documentation: {
        tags: [
          { name: 'Hello', description: 'testing' },
        ]
      }
    })
  ).group("/category", (app) => app.use(CategoryController))

export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;
export type APP = typeof app 
