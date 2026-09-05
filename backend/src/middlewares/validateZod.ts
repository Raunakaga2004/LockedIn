import { ZodType } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validateZod = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid request body',
      })
    }

    req.body = result.data;
    next();
  }
}

// Same idea as validateZod, but for GET requests whose filters travel as
// query params instead of a body (a GET with a JSON body isn't reliably
// sent by browsers/axios).
export const validateZodQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid query parameters',
      })
    }

    res.locals.query = result.data;
    next();
  }
}
