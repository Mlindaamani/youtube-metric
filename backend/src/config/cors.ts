import cors from 'cors';

export const createCorsConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  const frontendUrl = process.env.FRONTEND_URL;
  
  return cors({
    origin: environment === 'production' ? frontendUrl : 'http://localhost:8080',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};