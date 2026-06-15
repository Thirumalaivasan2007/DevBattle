import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import executionRoutes from './routes/executionRoutes';
import submissionRoutes from './routes/submissionRoutes';
import userRoutes from './routes/userRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import compareRoutes from './routes/compareRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/compare', compareRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('DevBattle API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
