import type { Request, Response, NextFunction } from "express";

const requireAuthId = (req: Request, res: Response, next: NextFunction) => {
    const auth0Id = req.auth?.payload.sub;

    if(!auth0Id) {
        return res.status(401).json({ error: "Token missing subject claim" });
    }

    req.userAuthId = auth0Id; 
    next();
}

export default requireAuthId;