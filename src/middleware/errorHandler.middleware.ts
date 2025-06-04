import { STATUS_CODE } from '@/constants/statuscode.const';
import { ApiError } from '@/utils/apiResponse';
import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  errors?: any;
}

const errorHandler = (err: MongoError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  // If it's already an ApiError, let it handle itself
  if (err instanceof ApiError) {
    return err.send(res);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as MongooseError.ValidationError).errors).map(e => e.message);
    const apiError = new ApiError(
      STATUS_CODE.BAD_REQUEST,
      'Validation Error',
      errors
    );
    return apiError.send(res);
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const apiError = new ApiError(
      STATUS_CODE.CONFLICT,
      'Duplicate entry found'
    );
    return apiError.send(res);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const apiError = new ApiError(
      STATUS_CODE.BAD_REQUEST,
      'Invalid ID format'
    );
    return apiError.send(res);
  }

  // Default error
  const apiError = new ApiError(
    STATUS_CODE.INTERNAL_SERVER_ERROR,
    'Internal Server Error'
  );
  apiError.send(res);
};

export default errorHandler;
