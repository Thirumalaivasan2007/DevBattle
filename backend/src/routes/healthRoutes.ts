import express from 'express';
import mongoose from 'mongoose';
import { getRedisClient } from '../services/redisService';

const router = express.Router();

// Liveness Probe: Basic application status
router.get('/liveness', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness Probe: Dependent services status (DB, Redis)
router.get('/readiness', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  const redisClient = getRedisClient();
  const redisStatus = redisClient && redisClient.isOpen ? 'connected' : 'disconnected';

  const isReady = dbStatus === 'connected'; // Redis is optional for our app

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      database: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      database: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString()
    });
  }
});

// Full System Health
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

export default router;
