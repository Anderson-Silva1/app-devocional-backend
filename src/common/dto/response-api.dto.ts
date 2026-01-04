export class ResponseApiDto<T> {
  sucess: boolean;
  meta?: Record<string, any>;
  message?: string;
  data?: T;
}
