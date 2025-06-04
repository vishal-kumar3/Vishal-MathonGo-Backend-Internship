import { Response } from 'express';

interface ApiResponseData {
  [key: string]: unknown;
}

class ApiResponse {
  public statusCode: number;
  public data: ApiResponseData;
  public message: string;
  public success: boolean;

  constructor(
    statusCode: number,
    data: ApiResponseData,
    message = "Success",
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  public send(res: Response): void {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      ...this.data
    });
  }
}

class ApiError extends Error {
  statusCode: number;
  message: string;
  data: any | null;
  success: boolean;
  errors: any[];
  stack?: string;

  constructor(
    statusCode: number,
    message: string = "Something Went Wrong!",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public send(res: Response): void {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: { ...res.locals.middlewareData },
    });
  }
}


export { ApiResponse, ApiResponseData, ApiError };
