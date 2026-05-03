import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import 'dotenv/config';

import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import homeRouter from './routes/homeRoutes.js';
import emotionRouter from './routes/emotionRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);

app.use(authRouter);
app.use(userRouter);
app.use(taskRouter);
app.use(noteRouter);
app.use(homeRouter);
app.use(emotionRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
