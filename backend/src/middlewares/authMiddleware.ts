import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      (req as any).user = await User.findById(decoded.id).select('-password');

      if ((req as any).user && (req as any).user.isBanned) {
        return res.status(403).json({ message: 'Your account has been banned. Reason: ' + ((req as any).user.banReason || 'Violating terms') });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && ((req as any).user.role === 'ADMIN' || (req as any).user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const superAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a super admin' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      (req as any).user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // ignore error
    }
  }
  next();
};
