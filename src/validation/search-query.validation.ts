import {
  BOOLEAN_FIELDS,
  MULTI_SELECT_FIELDS,
  RANGE_FIELDS,
} from '../models/search-fields.config';

type JsonObject = Record<string, unknown>;

/**
 * Validates a search request body against the InstrumentSearchQuery shape.
 * Returns a message for the first invalid key, or null when valid. Unknown keys are ignored.
 */
export function validateSearchQuery(body: unknown): string | null {
  if (!isObject(body)) {
    return 'Request body must be a JSON object';
  }

  if (body.search_text !== undefined && typeof body.search_text !== 'string') {
    return 'search_text must be a string';
  }

  if (body.order_by !== undefined && typeof body.order_by !== 'string') {
    return 'order_by must be a string';
  }

  for (const field of ['from', 'size']) {
    const value = body[field];
    if (
      value !== undefined &&
      !(typeof value === 'number' && Number.isInteger(value) && value >= 0)
    ) {
      return `${field} must be an integer >= 0`;
    }
  }

  for (const field of MULTI_SELECT_FIELDS) {
    const value = body[field];
    if (
      value !== undefined &&
      !(Array.isArray(value) && value.every((item) => typeof item === 'string'))
    ) {
      return `${field} must be an array of strings`;
    }
  }

  for (const field of BOOLEAN_FIELDS) {
    const filter = body[field];
    if (filter === undefined) {
      continue;
    }
    if (
      !isObject(filter) ||
      !(
        filter.value === undefined ||
        filter.value === null ||
        typeof filter.value === 'boolean'
      )
    ) {
      return `${field} must be an object like { "value": true }`;
    }
  }

  for (const field of RANGE_FIELDS) {
    const filter = body[field];
    if (filter === undefined) {
      continue;
    }
    if (!isObject(filter)) {
      return `${field} must be an object like { "min": "0", "max": "100" }`;
    }
    for (const bound of ['min', 'max']) {
      if (!isRangeBound(filter[bound])) {
        return `${field}.${bound} must be a numeric string`;
      }
    }
  }

  return null;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * A range bound is a numeric string, or empty / null / missing when not set.
 */
function isRangeBound(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  return (
    typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))
  );
}
