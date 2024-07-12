import { Request, Response } from "express";

export const CreateProfile = (req: Request, res: Response) => {
    res.send('criando perfil');
}