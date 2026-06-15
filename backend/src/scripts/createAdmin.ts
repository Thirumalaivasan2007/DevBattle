import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@devbattle.com';
    const adminPassword = 'admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      fullName: 'DevBattle Admin',
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    });

    await adminUser.save();
    console.log(`Admin user created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
