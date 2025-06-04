import mongoose, { Schema } from 'mongoose';
import { IChapter } from '@/types/index.types';

const chapterSchema = new Schema<IChapter>({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  chapter: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    required: true
  },
  questionSolved: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'In Progress', 'Not Started'],
    default: 'Not Started'
  },
  isWeakChapter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
chapterSchema.index({ class: 1, subject: 1 });
chapterSchema.index({ status: 1 });
chapterSchema.index({ isWeakChapter: 1 });

export default mongoose.model<IChapter>('Chapter', chapterSchema);
