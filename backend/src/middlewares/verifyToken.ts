import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export const verifyToken = (req : Request, res : Response, next : NextFunction) => {
  try{
    const token =  req.cookies.token;
    if(!token) return res.status(401).json({message : "Unauthorized"})

    if(!process.env.JWT_SECRET) {
      return res.status(500);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err : any, decoded : any) => {
      if (err) 
        return res.status(500).json({
          message: "Failed to authenticate token"}
        );
      
      (req as any).user = decoded;
      next();
    })
  }
  catch(e){
    return res.status(500).json({
      message : "Error during Authorization!"
    })
  }
}