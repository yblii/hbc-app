import type { Request, Response } from "express";
import * as GroupService from '../services/group.service';

export async function getGroups(req: Request, res: Response) {
    try {
        const groups = await GroupService.getGroups();
        return res.json(groups);
    } catch(error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({ error: "failed to fetch groups" });
    }
}

export async function createGroup(req: Request, res: Response) {
    try {
        const userId = req.auth?.payload.sub;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        res.json();
    } catch(error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ error: "failed to create group" });
    }
}