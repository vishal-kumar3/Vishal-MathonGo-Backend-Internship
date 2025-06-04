import { z, ZodError } from 'zod'

import { ApiError } from '@/utils/apiResponse';


export const zodValidator = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
) => {
  try {
    return schema.parse(data) as z.infer<T>
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')} - ${err.message}`)
        .join('; ');

      throw new ApiError(400, `Validation failed: ${errorMessage}`);
    }

    throw new ApiError(500, 'Internal server error');
  }
}
