import { Request, Response } from "express";

export const CreateProfile = (req: Request, res: Response) => {
    console.log(req.body);
}