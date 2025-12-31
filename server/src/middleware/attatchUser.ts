import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

export const attatchUser = async (req: Request, res: Response, next: NextFunction) => {
    const authId = req.auth?.payload.sub;
    if(!authId) {
        return res.status(401).json({ error: "Token missing subject claim" });
    }

    const user = await prisma.user.findUnique({
        where: {
            auth0Id: authId
        },
        select: {
            id: true
        }
    })

    if(!user) {
        return res.status(401).json({ error: 'User not registered in internal DB' });
    }

    req.userId = user.id;
    next();
}