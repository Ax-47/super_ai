import { Elysia } from 'elysia'
import { HelloWorldController } from './controllers/hello_world';
import { swagger } from '@elysiajs/swagger'
import { PromptController } from './controllers/chat';
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
  )
  .use(HelloWorldController)
  .use(PromptController)
  .use(CategoryController)

export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;
export type APP = typeof app 
