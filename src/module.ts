import { envConfig } from './shared/configs/env.config';

import { FacetsController } from './controllers/facets.controller';
import { SearchController } from './controllers/search.controller';
import {
  InstrumentsRepository,
  JsonInstrumentsRepository,
} from './repositories/instruments-json.repository';
import { FacetsService } from './services/facets.service';
import { SearchService } from './services/search.service';

/**
 * This module instantiates the repository, the services which depend on it and the controllers which are
 * exported to main to register their routes.
 */
export interface SearchModuleResult {
  searchController: SearchController;
  facetsController: FacetsController;
}

export function initSearchModule(): SearchModuleResult {
  const instrumentsRepository: InstrumentsRepository =
    new JsonInstrumentsRepository(envConfig.instrumentsFile);

  const searchService: SearchService = new SearchService(instrumentsRepository);

  const facetsService: FacetsService = new FacetsService(
    instrumentsRepository,
    searchService,
  );

  return {
    searchController: new SearchController(searchService),
    facetsController: new FacetsController(facetsService),
  };
}
