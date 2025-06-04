import { Document } from 'mongoose';

export interface IChapter extends Document {
  subject: string;
  chapter: string;
  class: string;
  unit: string;
  yearWiseQuestionCount: Record<string, number>;
  questionSolved: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  isWeakChapter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterFilters {
  class?: string;
  unit?: RegExp;
  status?: string;
  isWeakChapter?: boolean;
  subject?: RegExp;
}

export interface PaginationQuery {
  page: string;
  limit: string;
}

export interface ChapterQuery extends PaginationQuery {
  class?: string;
  unit?: string;
  status?: string;
  isWeakChapter?: string;
  subject?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UploadResult {
  successful: IChapter[];
  failed: FailedChapter[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface FailedChapter {
  index: number;
  data: any;
  error: string;
}
