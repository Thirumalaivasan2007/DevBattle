import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { initSocket } from './services/socketService';
import { startCronJobs } from './cron/contestCron';
import { connectDB } from './config/db';
import { connectRedis } from './services/redisService';
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import executionRoutes from './routes/executionRoutes';
import submissionRoutes from './routes/submissionRoutes';
import contestRoutes from './routes/contestRoutes';
import userRoutes from './routes/userRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import compareRoutes from './routes/compareRoutes';
import teamRoutes from './routes/teamRoutes';
import organizationRoutes from './routes/organizationRoutes';
import deviceRoutes from './routes/deviceRoutes';
import syncRoutes from './routes/syncRoutes';
import battleRoutes from './routes/battleRoutes';
import communityRoutes from './routes/communityRoutes';
import challengeRoutes from './routes/challengeRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import adminRoutes from './routes/adminRoutes';
import judgeRoutes from './routes/judgeRoutes';
import notificationRoutes from './routes/notificationRoutes';
import announcementRoutes from './routes/announcementRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { startCronJobs as startDailyCronJobs } from './services/cronService';

dotenv.config();

const app = express();

// Initialize Cron Jobs
startDailyCronJobs();
const server = createServer(app);
initSocket(server);

// Start Automated Cron Jobs
startCronJobs();

// Start Matchmaking Engine
import { startMatchmakingEngine } from './services/matchmakingService';
startMatchmakingEngine();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
app.set('trust proxy', 1); // Trust first proxy (Render, Vercel, etc.)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === 'production' ? 100 : 10000, // Higher limit for dev
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Database and Redis Connection
connectDB();
connectRedis();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/health', healthRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('DevBattle API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
