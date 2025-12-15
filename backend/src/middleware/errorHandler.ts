import type { Request, Response, NextFunction } from 'express';
import { config } from '@/config/index.ts';

// Custom error class for application-specific errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  message: string;
  error?: string | undefined;
  stack?: string | undefined;
  statusCode: number;
}

// Handle MongoDB/Mongoose errors
const handleMongoError = (error: any): AppError => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val: any) => val.message);
    return new AppError(`Validation Error: ${messages.join(', ')}`, 400);
  }
  
  if (error.name === 'CastError') {
    return new AppError('Invalid ID format', 400);
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)?.[0] || 'field';
    return new AppError(`Duplicate value for ${field}`, 409);
  }
  
  return new AppError('Database error', 500);
};

// Handle JWT errors
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401);
};

// Handle JWT expired errors
const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

// Handle YouTube API errors
const handleYouTubeAPIError = (error: any): AppError => {
  if (error.code === 403) {
    return new AppError('YouTube API quota exceeded or insufficient permissions', 403);
  }
  
  if (error.code === 401) {
    return new AppError('YouTube API authentication failed. Please re-authenticate.', 401);
  }
  
  if (error.code === 400) {
    return new AppError('Invalid YouTube API request', 400);
  }
  
  return new AppError('YouTube API error', 500);
};

// Send error response in development
const sendErrorDev = (err: AppError, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false as const,
    statusCode: err.statusCode,
    message: err.message,
    error: err.name,
    stack: err.stack
  };
  
  res.status(err.statusCode).json(errorResponse);
};

// Send error response in production
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false as const,
      statusCode: err.statusCode,
      message: err.message
    };
    
    res.status(err.statusCode).json(errorResponse);
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    
    const errorResponse: ErrorResponse = {
      success: false as const,
      statusCode: 500,
      message: 'Something went wrong!'
    };
    
    res.status(500).json(errorResponse);
  }
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Global error handling middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.stack = err.stack;

  // Handle specific error types
  if (error.name === 'CastError' || error.name === 'ValidationError' || error.code === 11000) {
    error = handleMongoError(error);
  }
  
  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  // Handle YouTube API errors
  if (error.message && error.message.includes('googleapis')) {
    error = handleYouTubeAPIError(error);
  }

  // Send error response based on environment
  if (config.environment === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error handler wrapper for route handlers
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default globalErrorHandler;
