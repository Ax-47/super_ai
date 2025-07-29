import Elysia, { t } from "elysia";
export const HelloWorldController = new Elysia().group('/hello',
  (app) =>
    app
      .get('/', () => "hello")
      .post('/', ({ body }) => body, {
        body: t.Object({
          name: t.String()
        })
      }
      )
)
