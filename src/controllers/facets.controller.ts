import { Context } from 'koa';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../shared/controllers/base.controller';
import {
  ApiEndpoint,
  QueryParam,
  RouteParam,
} from '../shared/models/endpoint.model';

import { InstrumentSearchQuery } from '../models/search-query.model';
import { FacetsService } from '../services/facets.service';
import { validateSearchQuery } from '../validation/search-query.validation';

export class FacetsController extends BaseController {
  constructor(private facetsService: FacetsService) {
    super();

    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get(ApiEndpoint.FacetKeys, this.getFacetKeys.bind(this));
    this.router.get(
      ApiEndpoint.FacetKeysByKind,
      this.getFacetKeysByKind.bind(this),
    );
    this.router.post(ApiEndpoint.FacetCounts, this.getFacetCounts.bind(this));
  }

  getFacetKeys(ctx: Context) {
    ctx.body = this.facetsService.getKeys();
  }

  async getFacetKeysByKind(ctx: Context) {
    ctx.body = await this.facetsService.getKeysByKind();
  }

  async getFacetCounts(ctx: Context) {
    const query = ctx.request.body as InstrumentSearchQuery;
    const error = validateSearchQuery(query);

    ctx.assert(!error, StatusCodes.BAD_REQUEST, error ?? '');

    const key: string = ctx.params[RouteParam.Key];
    const omitEmptyCounts = ctx.query[QueryParam.OmitEmptyCounts] === 'true';

    ctx.body = await this.facetsService.getCounts(key, query, omitEmptyCounts);
  }
}
