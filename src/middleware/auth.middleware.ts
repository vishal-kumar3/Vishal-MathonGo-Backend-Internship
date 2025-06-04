import { STATUS_CODE } from '@/constants/statuscode.const';
import { ApiError } from '@/utils/apiResponse';
import { Request, Response, NextFunction } from 'express';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const adminSecret = req.headers['admin-secret'] as string;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    throw new ApiError(STATUS_CODE.UNAUTHORIZED, 'Unauthorized. Admin access required.');
  }

  next();
};
