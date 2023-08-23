export type BaseRequestQuery = Record<
  string,
  string | boolean | number | (string | boolean | number)[]
>;

export type HttpClientRequest<
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = {
  body: RequestBody;
  url: string;
  method: string;
  credentails: string;
  mode: string;
  headers: HeadersInit;
  query: RequestQuery;
};

export type HttpClientResponse<
  ResponseData,
  RequestBody,
  RequestQuery extends BaseRequestQuery | void,
> = {
  data: ResponseData;
  originalResponse: Response;
  status: number;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  statusText: string;
  request: HttpClientRequest<RequestBody, RequestQuery>;
};

export type HttpClientErrorResponse<
  RequestBody,
  RequestQuery extends BaseRequestQuery | void
> = {
  request: HttpClientRequest<RequestBody, RequestQuery>;
}