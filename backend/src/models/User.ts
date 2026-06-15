import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  profilePicture?: string;
  bio?: string;
  
  // Rating & Progress
  rating: number;
  highestRating: number;
  rank: string; // Title like Beginner, Pupil etc
  
  // Location
  country?: string;
  state?: string;
  city?: string;
  
  // Education
  collegeName?: string;
  department?: string;
  graduationYear?: number;
  
  // Stats
  solvedProblems: number;
  contestsParticipated: number;
  streak: number;
  badgesCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    
    // Rating
    rating: { type: Number, default: 1000 },
    highestRating: { type: Number, default: 1000 },
    rank: { type: String, default: 'Beginner' },
    
    // Location
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    
    // Education
    collegeName: { type: String, default: '' },
    department: { type: String, default: '' },
    graduationYear: { type: Number },
    
    // Stats
    solvedProblems: { type: Number, default: 0 },
    contestsParticipated: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badgesCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Remove password from JSON representation
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
