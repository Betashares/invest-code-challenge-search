import Koa from 'koa';
import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import Router from '@koa/router';

import { FacetsController, SearchController, initSearchModule } from './index';
import { HealthController } from './health/health.controller';
import { envConfig } from './shared/configs/env.config';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { notFoundMiddleware } from './shared/middleware/not-found.middleware';

function bootstrap() {
  const app = new Koa();

  // Register app middlewares.
  registerAppMiddleware(app);

  // Initialise app modules and their controllers.
  const controllers: AppControllers = initAppModules();

  // Register app routes with controllers.
  registerAppRoutes(app, controllers);

  // Start serving.
  initServer(app);
}

try {
  bootstrap();
} catch (err) {
  console.error('Failed to init server:', err);
  process.exit(1);
}

/**
 * Initialise app modules and return resulting controllers.
 */
interface AppControllers {
  healthController: HealthController;
  searchController: SearchController;
  facetsController: FacetsController;
}

function initAppModules(): AppControllers {
  const healthController = new HealthController();

  const { searchController, facetsController } = initSearchModule();

  return { healthController, searchController, facetsController };
}

/**
 * Registers app routes with controllers.
 */
function registerAppRoutes(app: Koa, controllers: AppControllers) {
  const routers: Router[] = [
    controllers.healthController.getRouter(),
    controllers.searchController.getRouter(),
    controllers.facetsController.getRouter(),
  ];

  for (const router of routers) {
    // Throwing lets the error middleware return 405s as JSON.
    app.use(router.routes()).use(router.allowedMethods({ throw: true }));
  }
}

/**
 * Registers global middleware.
 */
function registerAppMiddleware(app: Koa) {
  app.use(errorMiddleware);
  app.use(notFoundMiddleware);
  app.use(cors());
  app.use(
    bodyParser({
      encoding: 'utf-8',
      parsedMethods: ['POST'],
      // Parse every POST body as JSON whatever its Content-Type, like the real Search API.
      detectJSON: () => true,
    }),
  );
}

/**
 * Initialises app server.
 */
function initServer(app: Koa) {
  const port = envConfig.port;
  app
    .listen(port)
    .on('listening', () =>
      console.log(`Search Mock API listening on http://localhost:${port}`),
    );
}
