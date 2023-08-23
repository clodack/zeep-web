import { HttpClientFetchError } from './errors/HttpClientFetchError';
import { HttpClientResponseError } from './errors/HttpClientResponseError';

import { BaseRequestQuery } from './types';

export function isHttpClientFetchError<
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
>(error: unknown): error is HttpClientFetchError<RequestBody, RequestQuery> {
  return error instanceof HttpClientFetchError;
}

export function isHttpClientResponseError<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
>(error: unknown): error is HttpClientResponseError<ResponseData, RequestBody, RequestQuery> {
  return error instanceof HttpClientResponseError;
}

export function isUnauthorizedHttpClientError<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
>(error: unknown): error is HttpClientResponseError<ResponseData, RequestBody, RequestQuery> & {
  status: 401
} {
  return error instanceof HttpClientResponseError && error.status === 401;
}

export function isNotFoundHttpClientError<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
>(error: unknown): error is HttpClientResponseError<ResponseData, RequestBody, RequestQuery> & {
  status: 404
} {
  return error instanceof HttpClientResponseError && error.status === 404;
}
