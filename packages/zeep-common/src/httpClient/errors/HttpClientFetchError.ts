import {
  BaseRequestQuery,
  HttpClientRequest,
  HttpClientErrorResponse,
} from '../types';

export class HttpClientFetchError<
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
> extends Error {
  type = 'HttpClientFetchError' as const;

  readonly request: HttpClientRequest<RequestBody, RequestQuery>;

  constructor(
    message: string,
    response: HttpClientErrorResponse<RequestBody, RequestQuery>
  ) {
    super(message);
    this.request = response.request;
  }
}
