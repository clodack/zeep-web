import { Controller, createScope } from 'rx-effects';
import {
  BehaviorSubject,
  catchError,
  defer,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { Logger } from '../logger';
import { shareSingleReplay } from '../rxjs';

import { HttpClientFetchError } from './errors/HttpClientFetchError';
import { HttpClientResponseError } from './errors/HttpClientResponseError';
import { createSearchParams } from './createSearchParams';
import { isHttpClientResponseError } from './heplpers';
import { BaseRequestQuery, HttpClientResponse, HttpClientRequest } from './types';
import { isPlainObject } from './utils';

export type HttpClientError<
  ResposeData = unknown,
  RequestBody = unknown,
  RequestQuery extends BaseRequestQuery | void = void,
> =
  | HttpClientResponseError<ResposeData, RequestBody, RequestQuery>
  | HttpClientFetchError<RequestBody, RequestQuery>;


export type HttpRequestConfigurator = (
  init: RequestInit,
  headers: Headers,
) => void;

export type HttpClientSelector<
  ServerResponseData,
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = (
  response: HttpClientResponse<ServerResponseData, RequestBody, RequestQuery>,
) => Promise<ResponseData>;

export type HttpClientValidateResponse<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = (
  response: HttpClientResponse<ResponseData, RequestBody, RequestQuery>,
) => boolean;

type BaseHttpFetchMethodParams = {
  method:
    | 'GET'
    | 'PUT'
    | 'POST'
    | 'PATCH'
    | 'DELETE'
    | 'get'
    | 'put'
    | 'post'
    | 'patch'
    | 'delete';
};
type BaseHttpFetchParams<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = {
  url: string;

  requestConfig?: HttpRequestConfigurator;
  /**
   * @default json
   */
  responseType?: 'json' | 'text' | 'stream' | 'blob';
  validateResponse?: HttpClientValidateResponse<
    ResponseData,
    RequestBody,
    RequestQuery
  >;
  selector?: HttpClientSelector<
    ResponseData,
    ResponseData,
    RequestBody,
    RequestQuery
  >;
};

type BaseHttpFetchParamsQuery<RequestQuery> = RequestQuery extends void
  ? Partial<{ query: RequestQuery }>
  : { query: RequestQuery };

type BaseHttpFetchParamsBody<RequestBody> = RequestBody extends void
  ? Partial<{ body: RequestBody }>
  : { body: RequestBody };

type HttpFetchParams<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = BaseHttpFetchMethodParams &
  BaseHttpFetchParams<ResponseData, RequestBody, RequestQuery> &
  BaseHttpFetchParamsQuery<RequestQuery> &
  BaseHttpFetchParamsBody<RequestBody>;

type HttpFetchGetParams<
  ResponseData,
  RequestQuery extends BaseRequestQuery | void,
> = BaseHttpFetchParams<ResponseData, void, RequestQuery> &
  BaseHttpFetchParamsQuery<RequestQuery>;

type HttpFetchDefaultParams<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = BaseHttpFetchParams<ResponseData, RequestBody, RequestQuery> &
  BaseHttpFetchParamsQuery<RequestQuery> &
  BaseHttpFetchParamsBody<RequestBody>;

export type HttpClient = {
  fetch: <
    ResponseData = void,
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchParams<ResponseData, RequestBody, RequestQuery>,
  ) => Observable<HttpClientResponse<ResponseData, RequestBody, RequestQuery>>;
  post: <
    ResponseData = void,
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchDefaultParams<ResponseData, RequestBody, RequestQuery>,
  ) => Observable<HttpClientResponse<ResponseData, RequestBody, RequestQuery>>;
  get: <
    ResponseData = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchGetParams<ResponseData, RequestQuery>,
  ) => Observable<HttpClientResponse<ResponseData, void, RequestQuery>>;
  delete: <
    ResponseData = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchGetParams<ResponseData, RequestQuery>,
  ) => Observable<HttpClientResponse<ResponseData, void, RequestQuery>>;
};

export type HttpClientParams = {
  logger?: Logger;
  requestConfig?: HttpRequestConfigurator;
};

export const NOOP_REQUEST_TRANSFORMER: HttpRequestConfigurator = () => {};

export const DEFAULT_OK_RESPONSE_VALIDATOR: HttpClientValidateResponse<
  unknown,
  unknown,
  BaseRequestQuery | void
> = (response) => {
  return response.ok; // по умолчанию статус коды 200-299
};

export const SKIP_RESPONSE_VALIDATOR = (): boolean => true;

export function createHttpClient(
  params?: HttpClientParams,
): Controller<HttpClient> {
  const logger = params?.logger;
  const baseRequestConfig = params?.requestConfig ?? NOOP_REQUEST_TRANSFORMER;

  logger?.info('HTTP client is created');

  const scope = createScope();

  const isDestroyedSubject = new BehaviorSubject(false);
  const isDestroyed$ = isDestroyedSubject.pipe(
    filter(Boolean),
    shareSingleReplay(),
  );
  scope.add(() => isDestroyedSubject.next(true));

  function createRequestInit<
    ResponseData = void,
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchParams<ResponseData, RequestBody, RequestQuery>,
  ): RequestInit {
    const { method, body, requestConfig } = params;
    const headers = new Headers();
    const requestInit: RequestInit = { method, headers };

    if (body && isPlainObject(body)) {
      headers.set('Content-Type', 'application/json');
      requestInit.body = JSON.stringify(body);
    }

    baseRequestConfig(requestInit, headers);
    requestConfig?.(requestInit, headers);

    // Make sure that no one reassigned the headers.
    requestInit.headers = headers;

    return requestInit;
  }

  function createHttpClientRequest<
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(params: {
    body: RequestBody;
    credentials: RequestInit['credentials'];
    mode: RequestInit['mode'];
    method: RequestInit['method'];
    headers: RequestInit['headers'];
    query: RequestQuery;
    url: string;
  }): HttpClientRequest<RequestBody, RequestQuery> {
    const { body, credentials, url, headers, method, mode, query } = params;

    const parsedUrl = new URL(url, location.origin);

    if (query) {
      parsedUrl.search = createSearchParams(query, parsedUrl.search);
    }

    return {
      body,
      credentials: credentials || 'include',
      headers: headers || new Headers(),
      method: method || 'GET',
      mode: mode || 'cors',
      url: parsedUrl.toString(),
      query,
    };
  }

  function createHttpClientResponse<
    ResponseData = void,
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    request: HttpClientRequest<RequestBody, RequestQuery>,
    response: Response,
    responseData: ResponseData,
  ): HttpClientResponse<ResponseData, RequestBody, RequestQuery> {
    return {
      request,
      originalResponse: response,
      data: responseData,
      headers: response.headers,
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
    };
  }

  function fetch<
    ResponseData = void,
    RequestBody = void,
    RequestQuery extends BaseRequestQuery | void = void,
  >(
    params: HttpFetchParams<ResponseData, RequestBody, RequestQuery>,
  ): Observable<HttpClientResponse<ResponseData, RequestBody, RequestQuery>> {
    const {
      url,
      body,
      selector,
      responseType = 'json',
      validateResponse = DEFAULT_OK_RESPONSE_VALIDATOR,
    } = params;

    const requestInit = createRequestInit<
      ResponseData,
      RequestBody,
      RequestQuery
    >(params);

    const requestInfo = `${requestInit.method} ${url}`;

    const request = createHttpClientRequest<RequestBody, RequestQuery>({
      body: body as RequestBody,
      credentials: requestInit.credentials,
      headers: requestInit.headers,
      method: requestInit.method,
      mode: requestInit.mode,
      url,
      query: params.query as RequestQuery,
    });

    return defer(() => {
      logger?.debug(`Request ${requestInfo}`, body ?? requestInit.body);

      return fromFetch(request.url, requestInit);
    }).pipe(
      tap({
        next: (response) => {
          if (!response.ok) {
            logger?.debug(
              `Response is not OK. Status ${response.status} for ${requestInfo}`,
            );
            return;
          }
        },
      }),
      switchMap((response) => {
        const context = createHttpClientResponse<
          undefined,
          RequestBody,
          RequestQuery
        >(request, response, undefined);

        let $result: Observable<ResponseData> = of(undefined as ResponseData);

        if (responseType === 'json') {
          const contentType = context.headers.get('content-type');

          if (contentType?.includes('application/json')) {
            $result = from(response.json());
          }
        } else if (responseType === 'text') {
          $result = from(response.text()) as Observable<ResponseData>;
        } else if (responseType === 'stream' && response.body) {
          $result = observableFromStream(
            response.body,
          ) as Observable<ResponseData>;
        } else if (responseType === 'blob') {
          $result = from(response.blob()) as Observable<ResponseData>;
        }

        return $result.pipe(
          switchMap((result) => {
            if (selector) {
              const httpClientResponse = createHttpClientResponse<
                ResponseData,
                RequestBody,
                RequestQuery
              >(request, response, result);

              return from(selector(httpClientResponse));
            }

            return of(result);
          }),
          map((result) => {
            const httpClientResponse = createHttpClientResponse<
              ResponseData,
              RequestBody,
              RequestQuery
            >(request, response, result);

            if (!validateResponse(httpClientResponse)) {
              throw new HttpClientResponseError(
                `Response has invalid status ${context.status}`,
                httpClientResponse,
              );
            }

            return httpClientResponse;
          }),
        );
      }),
      catchError((err) => {
        const error: Error = err;
        if (isHttpClientResponseError(error)) {
          // Rethrow server or validation errors as is.
          throw error;
        }

        // Throw all unexpected errors as HttpClientFetchError
        throw new HttpClientFetchError(error.message || 'Fetch error', {
          request,
        });
      }),
      tap({
        next: (context) => {
          logger?.debug(
            `Response (${context.status}) ${requestInfo}`,
            context.data,
          );
        },
        error: (error) => {
          logger?.warn(`Failed to request ${requestInfo}`, error?.message);
        },
      }),
      takeUntil(isDestroyed$),
    );
  }

  return {
    destroy: scope.destroy,
    fetch,
    get: (params) => fetch({ method: 'get', ...params, body: undefined }),
    delete: (params) => fetch({ method: 'delete', ...params, body: undefined }),
    post: (params) => fetch({ method: 'post', ...params }),
  };
}

function observableFromStream<T>(stream: ReadableStream<T>): Observable<T> {
  return new Observable((subscriber) => {
    stream.pipeTo(
      new WritableStream({
        write: (chunk) => {
          subscriber.next(chunk);
        },
        abort: (error) => {
          subscriber.error(error);
        },
        close: () => {
          subscriber.complete();
        },
      }),
    );
    return () => {
      if (!stream.locked) {
        stream.cancel();
      }
    };
  });
}
