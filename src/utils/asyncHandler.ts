import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";

import { STATUS_CODE } from "@/constants/statuscode.const";
import { ApiError } from "@/utils/apiResponse";


const asyncHandler = <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  requestHandler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void> | void
) => {
  return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((error: unknown) => {
      if (error instanceof ApiError) {
        error.send(res);
      } else {
        const message = error instanceof Error ? error.message : String(error);
        new ApiError(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          message || "Internal Server Error",
          error instanceof Error ? [error.message] : [error],
          error instanceof Error ? error.stack : undefined
        ).send(res);
      }
    });
  };
};


export { asyncHandler };
