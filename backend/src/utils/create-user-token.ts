import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserTokenType{
    id: string;
}

export const createUserToken = async (user: UserTokenType, req: Request, res: Response) => {

    //create token
    const token = jwt.sign({
        id: user.id
    }, "nw93A4sF6QAQ-dindin");

    //return token
    res.status(200).json({message: "User Authenticated", token: token})
}