import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { fullName, username, email, password } = validatedData;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      res.status(400).json({ message: 'User already exists with that email or username' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        rating: user.rating,
        rank: user.rank,
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        rating: user.rating,
        rank: user.rank,
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user?._id);

  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      rating: user.rating,
      rank: user.rank,
      solvedProblems: user.solvedProblems,
      contestsParticipated: user.contestsParticipated,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      badgesCount: user.badgesCount,
      xp: user.xp,
      level: user.level,
      coins: user.coins,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    // TODO: Implement email sending logic in future phases
    res.json({ message: 'If email exists, a password reset link has been sent. (Not fully implemented in Phase 1)' });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    // TODO: Implement token verification and password update logic
    res.json({ message: 'Password reset successful. (Not fully implemented in Phase 1)' });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
