import {
  BaseRequestQuery,
  HttpClientRequest,
  HttpClientResponse,
} from '../types';

export class HttpClientResponseError<
  ResposeData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> extends Error {
  type = 'HttpClientResponseError' as const;

  readonly request: HttpClientRequest<RequestBody, RequestQuery>;
  readonly status: number;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly statusText: string;
  readonly data: ResposeData;
  readonly originalResponse: Response;

  constructor(
    message: string,
    response: HttpClientResponse<ResposeData, RequestBody, RequestQuery>,
    replaceResponseData?: ResposeData,
  ) {
    super(message);

    this.request = response.request;
    this.status = response.status;
    this.headers = response.headers;
    this.redirected = response.redirected;
    this.statusText = response.statusText;
    this.ok = response.ok;
    this.originalResponse = response.originalResponse;
    this.data = replaceResponseData ?? response.data;
  }
}
