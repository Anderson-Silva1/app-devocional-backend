export class ResponseApiDto<T> {
  sucess: boolean;
  statusCode: number;
  meta?: Record<string, any>;
  message?: string;
  data?: T;
}
