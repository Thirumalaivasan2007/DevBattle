import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // For development. Adjust for production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific contest room to receive updates
    socket.on('join_contest', (contestId: string) => {
      socket.join(`contest_${contestId}`);
      console.log(`Socket ${socket.id} joined contest_${contestId}`);
    });

    socket.on('leave_contest', (contestId: string) => {
      socket.leave(`contest_${contestId}`);
      console.log(`Socket ${socket.id} left contest_${contestId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    // --- BATTLE EVENTS ---
    socket.on('join_user', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user_${userId}`);
    });

    socket.on('join_battle', (battleId: string) => {
      socket.join(`battle_${battleId}`);
      console.log(`Socket ${socket.id} joined battle_${battleId}`);
    });

    socket.on('leave_battle', (battleId: string) => {
      socket.leave(`battle_${battleId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Emits rank/score updates for a contest
export const emitContestUpdate = (contestId: string, data: any) => {
  if (io) {
    io.to(`contest_${contestId}`).emit('contest:update', data);
  }
};

// Emits live submissions
export const emitLiveSubmission = (contestId: string, submissionData: any) => {
  if (io) {
    io.to(`contest_${contestId}`).emit('contest:submission', submissionData);
  }
};

// Emits an announcement
export const emitAnnouncement = (contestId: string, announcement: any) => {
  if (io) {
    io.to(`contest_${contestId}`).emit('contest:announcement', announcement);
  }
};

// --- BATTLE EMITTERS ---
export const emitBattleFound = (userId: string, battleData: any) => {
  if (io) io.to(`user_${userId}`).emit('battle:found', battleData);
};

export const emitBattleStart = (battleId: string, battleData: any) => {
  if (io) io.to(`battle_${battleId}`).emit('battle:start', battleData);
};

export const emitBattleUpdate = (battleId: string, eventName: string, data: any) => {
  if (io) io.to(`battle_${battleId}`).emit(eventName, data);
};

// --- NOTIFICATION EMITTERS ---
export const emitNotification = (userId: string, notificationData: any) => {
  if (io) io.to(`user_${userId}`).emit('notification:new', notificationData);
};

export const emitGlobalAnnouncement = (announcementData: any) => {
  if (io) io.emit('announcement:new', announcementData);
};
