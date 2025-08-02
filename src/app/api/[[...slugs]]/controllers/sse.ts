const sseEvent = (data: string): string => `data: ${data}\n\n`;
export type SSEGenerator<Ctx extends object, T> = (
  ctx: Ctx
) => AsyncGenerator<T>;
export interface SSEContext {
  set: {
    headers: Record<string, string>;
  };
}
export function sse<Ctx extends SSEContext, T>(
  generator: SSEGenerator<Ctx, T>
): (ctx: Ctx) => AsyncGenerator<string> {
  return async function* (ctx: Ctx): AsyncGenerator<string> {
    ctx.set.headers = {
      ...ctx.set.headers,
      "x-accel-buffering": "no",
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
    };

    for await (const data of generator(ctx)) {
      yield sseEvent(JSON.stringify(data));
    }
  };
}
