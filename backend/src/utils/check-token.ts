import { NextFunction, Request, Response } from "express";
import { getToken } from "./get-token";
import * as jwt from 'jsonwebtoken';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        return res.status(401).json({message: "User Unauthenticated"})
    }

    const token = getToken(req);

    if(token === undefined){
        return res.status(401).json({message: "User Unauthenticated"})
    }

    try{
        const decoded = jwt.verify(token, "nw93A4sF6QAQ-dindin");
        req.user = (decoded as jwt.JwtPayload).id;
        next();
    }catch(err: unknown){
        return res.status(400).json({message: "Invalid Token"});
    }
}