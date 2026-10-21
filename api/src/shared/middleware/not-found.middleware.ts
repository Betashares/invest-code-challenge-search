import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';

/**
 * Responds to unknown routes with { error: 404 }, mirroring the real Search API.
 */
export async function notFoundMiddleware(ctx: Context, next: Next) {
  await next();

  if (ctx.status === StatusCodes.NOT_FOUND && ctx.body === undefined) {
    ctx.status = StatusCodes.NOT_FOUND;
    ctx.body = { error: StatusCodes.NOT_FOUND };
  }
}
