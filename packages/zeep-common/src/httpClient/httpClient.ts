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
import { sharewSingleReplay } from '../rxjs';

import { HttpClientFetchError } from './errors/HttpClientFetchError';
import { HttpClientResponseError } from './errors/HttpClientResponseError';
import { createSearchParams } from './createSearchParams';
import { BaseRequestQuery } from './types';
import { isPlainObject } from './utils';

export type HttpClientError<
  ResposeData = unknown,
  RequestBody = unknown,
  RequestQuery extends BaseRequestQuery | void = void,
> =
  | HttpClientResponseError<ResposeData, RequestBody, RequestQuery>
  | HttpClientFetchError<RequestBody, RequestQuery>;