import { Request, Response } from 'express';
import Chapter from '@/models/Chapter';
import {
  chapterValidationSchema,
  chapterQuerySchema,
  chapterParamsSchema,
  uploadChaptersBodySchema
} from '@/zodSchema/chapter.schema';
import { getCachedData, setCachedData, deleteCachedData, generateCacheKey } from '@/utils/cache';
import { ChapterFilters, UploadResult, IChapter, FailedChapter } from '@/types/index.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse, ApiError } from '@/utils/apiResponse';
import { STATUS_CODE } from '@/constants/statuscode.const';
import { zodValidator } from '@/utils/zodValidator';

export const getAllChapters = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = zodValidator(chapterQuerySchema, req.query);

  const {
    class: classFilter,
    unit,
    status,
    isWeakChapter,
    subject,
    page,
    limit
  } = validatedQuery;

  const filters: ChapterFilters = {};
  if (classFilter) filters.class = classFilter;
  if (unit) filters.unit = new RegExp(unit, 'i');
  if (status) filters.status = status;
  if (isWeakChapter !== undefined) filters.isWeakChapter = isWeakChapter === 'true';
  if (subject) filters.subject = new RegExp(subject, 'i');

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const cacheKey = generateCacheKey('chapters', filters, pageNum, limitNum);
  const cachedResult = await getCachedData<any>(cacheKey);
  if (cachedResult) {
    return new ApiResponse(
      STATUS_CODE.OK,
      {
        chapters: cachedResult.data,
        pagination: cachedResult.pagination
      },
      'Chapters fetched successfully (cached)').send(res);
  }

  const [chapters, totalCount] = await Promise.all([
    Chapter.find(filters)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Chapter.countDocuments(filters)
  ]);

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(totalCount / limitNum),
    totalCount,
    hasNext: skip + limitNum < totalCount,
    hasPrev: pageNum > 1
  };

  const result = {
    data: chapters,
    pagination
  };

  await setCachedData(cacheKey, result);

  new ApiResponse(STATUS_CODE.OK, { chapters, pagination }, 'Chapters fetched successfully').send(res);
});

export const getChapterById = asyncHandler(async (req: Request, res: Response) => {
  const validatedParams = zodValidator(chapterParamsSchema, req.params);
  const { id } = validatedParams;

  const chapter = await Chapter.findById(id);

  if (!chapter) {
    throw new ApiError(STATUS_CODE.NOT_FOUND, 'Chapter not found');
  }

  new ApiResponse(STATUS_CODE.OK, { chapter }, 'Chapter fetched successfully').send(res);
});

export const uploadChapters = asyncHandler(async (req: Request, res: Response) => {
  let chaptersData: any[];

  if (req.file) {
    if (req.file.mimetype !== 'application/json') {
      throw new ApiError(STATUS_CODE.BAD_REQUEST, 'Uploaded file must be a JSON file');
    }
    try {
      chaptersData = JSON.parse(req.file.buffer.toString());
    } catch (parseError) {
      throw new ApiError(STATUS_CODE.BAD_REQUEST, 'Invalid JSON file format');
    }
  } else {
    const validatedBody = zodValidator(uploadChaptersBodySchema, req.body);
    const { chapters } = validatedBody;

    if (!chapters) {
      throw new ApiError(STATUS_CODE.BAD_REQUEST, 'No chapters data provided');
    }

    chaptersData = chapters;
  }

  if (!Array.isArray(chaptersData)) {
    throw new ApiError(STATUS_CODE.BAD_REQUEST, 'Chapters data must be an array');
  }

  const successfulChapters: IChapter[] = [];
  const failedChapters: FailedChapter[] = [];

  for (let i = 0; i < chaptersData.length; i++) {
    const chapterData = chaptersData[i];

    try {
      const validatedData = zodValidator(chapterValidationSchema, chapterData);

      const chapter = new Chapter(validatedData);
      const savedChapter = await chapter.save();
      successfulChapters.push(savedChapter);

    } catch (validationError) {
      failedChapters.push({
        index: i,
        data: chapterData,
        error: validationError instanceof Error ? validationError.message : 'Validation failed'
      });
    }
  }

  if (successfulChapters.length > 0) {
    await deleteCachedData('chapters:*');
  }

  const uploadResult: UploadResult = {
    successful: successfulChapters,
    failed: failedChapters,
    summary: {
      total: chaptersData.length,
      successful: successfulChapters.length,
      failed: failedChapters.length
    }
  };

  new ApiResponse(
    STATUS_CODE.CREATED,
    { ...uploadResult },
    `${successfulChapters.length} chapters uploaded successfully`
  ).send(res);
});
