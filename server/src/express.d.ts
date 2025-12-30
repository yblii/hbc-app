import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userAuthId?: string;
      auth?: {
        payload: {
          sub: string;
        }
      }
    }
  }
}