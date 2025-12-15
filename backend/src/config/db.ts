import mongoose from 'mongoose';
import { config } from './index.ts';


export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Optional: Graceful shutdown
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error: any) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};