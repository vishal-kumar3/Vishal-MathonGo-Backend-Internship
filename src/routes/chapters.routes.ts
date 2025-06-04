import { getAllChapters, getChapterById, uploadChapters } from '@/controllers/chapter.controllers';
import { adminAuth } from '@/middleware/auth.middleware';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JSON files are allowed'));
    }
  }
});

// GET /api/v1/chapters - Get all chapters with filtering and pagination
router.get('/', getAllChapters);

// GET /api/v1/chapters/:id - Get specific chapter
router.get('/:id', getChapterById);

// POST /api/v1/chapters - Upload chapters (Admin only)
router.post('/', adminAuth, upload.single('chapters'), uploadChapters);

export default router;
