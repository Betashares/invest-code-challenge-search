import { Context } from 'koa';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../../../shared/controllers/base.controller';
import {
  ApiEndpoint,
  QueryParam,
  RouteParam,
} from '../../../shared/models/endpoint.model';

import { InstrumentDocument } from '../models/instrument.model';
import {
  InstrumentSearchQuery,
  SearchResponse,
} from '../models/search-query.model';
import { SearchService } from '../services/search.service';
import { validateSearchQuery } from '../validation/search-query.validation';

enum ErrorMessage {
  InstrumentNotFound = 'Instrument not found',
}

export class SearchController extends BaseController {
  constructor(private searchService: SearchService) {
    super();

    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(ApiEndpoint.Search, this.search.bind(this));
    this.router.get(ApiEndpoint.Instrument, this.getInstrument.bind(this));
  }

  async search(ctx: Context) {
    const query = ctx.request.body as InstrumentSearchQuery;
    const error = validateSearchQuery(query);

    ctx.assert(!error, StatusCodes.BAD_REQUEST, error ?? '');

    const fields = this.getFieldsParam(ctx);
    const { results, count, indexed_at } =
      await this.searchService.search(query);

    const response: SearchResponse = {
      results: results.map((document) => pickFields(document, fields)),
      count,
      indexed_at,
    };

    ctx.body = response;
  }

  async getInstrument(ctx: Context) {
    const id: string = ctx.params[RouteParam.Id];
    const instrument = await this.searchService.getById(id);

    ctx.assert(
      instrument,
      StatusCodes.NOT_FOUND,
      `${ErrorMessage.InstrumentNotFound}: ${id}`,
    );

    ctx.body = pickFields(instrument, this.getFieldsParam(ctx));
  }

  /**
   * Reads the ?fields=a,b query param into a list of field names.
   */
  private getFieldsParam(ctx: Context): string[] {
    const fields = ctx.query[QueryParam.Fields];

    return typeof fields === 'string'
      ? fields.split(',').map((field) => field.trim())
      : [];
  }
}

/**
 * Returns only the requested fields of a document, or the whole document when none of them exist.
 */
function pickFields(
  document: InstrumentDocument,
  fields: string[],
): Partial<InstrumentDocument> {
  const picked = Object.entries(document).filter(([field]) =>
    fields.includes(field),
  );

  return picked.length > 0 ? Object.fromEntries(picked) : document;
}
