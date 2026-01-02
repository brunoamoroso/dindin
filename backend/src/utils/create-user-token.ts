import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserTokenType{
    id: string;
}

interface CreateUserTokenOptions {
    redirectTo?: string;
}

export const createUserToken = async (
    user: UserTokenType,
    _req: Request,
    res: Response,
    options: CreateUserTokenOptions = {}
) => {

    //create token
    const token = jwt.sign({
        id: user.id
    }, "nw93A4sF6QAQ-dindin");

    if (options.redirectTo) {
        res.cookie("token", token, {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "prod",
        });
        return res.redirect(options.redirectTo);
    }

    //return token
    return res.status(200).json({message: "User Authenticated", token: token})
}
