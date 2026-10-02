import Router from '@koa/router';

export class BaseController {
  protected router: Router;

  constructor() {
    this.router = new Router();
  }

  getRouter(): Router {
    return this.router;
  }
}
