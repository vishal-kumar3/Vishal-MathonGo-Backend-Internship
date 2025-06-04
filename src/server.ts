import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from '@/config/database';
import { connectRedis } from '@/config/redis';
import errorHandler from '@/middleware/errorHandler.middleware';

import chapterRoutes from '@/routes/chapters.routes';
import { ApiResponse } from '@/utils/apiResponse';
import { STATUS_CODE } from '@/constants/statuscode.const';

const app = express();

const initializeApp = async () => {
  await connectDB();
  await connectRedis();

  const { default: rateLimiter } = await import('@/middleware/rateLimiter.middleware');

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(rateLimiter);

  app.use('/api/v1/chapters', chapterRoutes);

  app.get('/health', (req, res) => {
    new ApiResponse(STATUS_CODE.OK, {}, 'Server is running').send(res);
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initializeApp().catch((error) => {
  console.error('Failed to initialize application:', error);
  process.exit(1);
});
