import {ZodType} from 'zod'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export const validateZod = (schema : ZodType) => {
  return (req : Request, res : Response, next : NextFunction) => {
    
    const result = schema.safeParse(req.body);
    
    if(!result.success){
      return res.status(400).json({
        message: 'Invalid request body',
      })
    }

    req.body = result.data;
    next();
  }
}