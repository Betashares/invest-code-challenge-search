import { Context } from 'koa';
import Router from '@koa/router';

import { QueryParam } from '../models/endpoint.model';

export class BaseController {
  protected router: Router;

  constructor() {
    this.router = new Router();
  }

  getRouter(): Router {
    return this.router;
  }

  /**
   * Reads the ?fields=a,b query param into a list of field names.
   */
  protected getFieldsParam(ctx: Context): string[] {
    const fields = ctx.query[QueryParam.Fields];

    return typeof fields === 'string'
      ? fields.split(',').map((field) => field.trim())
      : [];
  }

  /**
   * Returns only the requested fields of a document, or the whole document when none of them exist.
   */
  protected pickFields<T extends object>(
    document: T,
    fields: string[],
  ): Partial<T> {
    const picked = Object.entries(document).filter(([field]) =>
      fields.includes(field),
    );

    return picked.length > 0
      ? (Object.fromEntries(picked) as Partial<T>)
      : document;
  }
}
