import mongoose from 'mongoose';
import { config } from '@/config/index.ts';

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

class Database {
  private static _instance: Database;
  private connectionPromise: Promise<typeof mongoose>;

  private constructor() {
    this.connectionPromise = mongoose.connect(config.mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
    });

    // Prevent multiple connections in development
    if (config.environment === 'development') {
      global._mongoosePromise = this.connectionPromise;
    }
  }

  public static get instance(): Promise<typeof mongoose> {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance.connectionPromise;
  }

  public static async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}

export default Database;