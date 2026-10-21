import { Context } from 'koa';

import { BaseController } from '../shared/controllers/base.controller';
import { ApiEndpoint } from '../shared/models/endpoint.model';

export class HealthController extends BaseController {
  constructor() {
    super();

    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get(ApiEndpoint.Health, this.getHealthCheck.bind(this));
  }

  getHealthCheck(ctx: Context) {
    ctx.body = 'Successful health check of the Search Mock API.';
  }
}
