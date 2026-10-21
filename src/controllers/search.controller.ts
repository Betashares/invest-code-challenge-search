import { Context } from 'koa';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../shared/controllers/base.controller';
import { ApiEndpoint, RouteParam } from '../shared/models/endpoint.model';

import {
  InstrumentSearchQuery,
  SearchResponse,
} from '../models/search-query.model';
import { SearchService } from '../services/search.service';
import { validateSearchQuery } from '../validation/search-query.validation';
import type { InstrumentDocument } from '../models/instrument.model';

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

    ctx.body = await this.getSearchResponse(ctx, query);
  }

  async getInstrument(ctx: Context) {
    const id: string = ctx.params[RouteParam.Id];
    const instrument = await this.searchService.getById(id);

    ctx.assert(
      instrument,
      StatusCodes.NOT_FOUND,
      `${ErrorMessage.InstrumentNotFound}: ${id}`,
    );

    ctx.body = this.pickFields(instrument, this.getFieldsParam(ctx));
  }

  /**
   * Runs the search and returns only the fields requested in ?fields= for each result.
   */
  private async getSearchResponse(
    ctx: Context,
    query: InstrumentSearchQuery,
  ): Promise<SearchResponse> {
    const fields = this.getFieldsParam(ctx);
    const { results, count, indexed_at } =
      await this.searchService.search(query);

    const filteredResults: Partial<InstrumentDocument>[] = results.map(
      (document) => this.pickFields(document, fields),
    );

    return {
      results: filteredResults,
      count,
      indexed_at,
    };
  }
}
