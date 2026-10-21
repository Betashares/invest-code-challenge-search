import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';

/**
 * Returns every error as JSON { message }. Errors raised with ctx.throw / ctx.assert, and invalid JSON bodies,
 * keep their 4xx status and message. Anything else is logged and returned as a 500.
 */
export async function errorMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const error = err as Error & { status?: number };
    const status = error.status ?? StatusCodes.INTERNAL_SERVER_ERROR;

    if (status >= StatusCodes.INTERNAL_SERVER_ERROR) {
      console.error(err);
    }

    ctx.status = status;
    ctx.body = {
      message:
        status >= StatusCodes.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : error.message,
    };
  }
}
